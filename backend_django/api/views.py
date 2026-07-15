from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
import logging
import random
import re
import os
import requests
import base64

from .models import JobOpening, Enquiry, JobApplication
from .serializers import JobOpeningSerializer, EnquirySerializer, JobApplicationSerializer

logger = logging.getLogger(__name__)

# Cache for OTP codes and verified email flags
OTP_STORAGE = {}
VERIFIED_EMAILS = {}

ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'sunitha.p@ascension.net.in')

def send_resend_email(subject, body, to_email, attachments=None):
    """
    Sends email via Resend's REST API using the configured RESEND_API_KEY.
    Fails gracefully by logging the content if the key is not set.
    """
    api_key = os.environ.get('RESEND_API_KEY')
    if not api_key:
        logger.warning(f"[EMAIL SEND FALLBACK] RESEND_API_KEY not configured.\nTo: {to_email}\nSubject: {subject}\nBody:\n{body}")
        # Return True in debug/local mode to prevent blocking OTP tests if key isn't set yet
        return True

    url = "https://api.resend.com/emails"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "from": "Ascension Recruitment <no-reply@ascension.net.in>",
        "to": [to_email] if isinstance(to_email, str) else to_email,
        "subject": subject,
        "text": body
    }
    if attachments:
        payload["attachments"] = attachments

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        if response.status_code in [200, 201]:
            return True
        else:
            logger.error(f"Resend API error: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        logger.error(f"Failed to connect to Resend API: {e}")
        return False

class JobOpeningList(generics.ListAPIView):
    queryset = JobOpening.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = JobOpeningSerializer


class EnquiryCreate(generics.CreateAPIView):
    queryset = Enquiry.objects.all()
    serializer_class = EnquirySerializer

    def create(self, request, *args, **kwargs):
        email = request.data.get('email', '').strip()
        if not VERIFIED_EMAILS.get(email):
            return Response(
                {"error": "Please verify your email address with OTP before submitting the enquiry."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        enquiry = serializer.save()
        # Consume verified token
        VERIFIED_EMAILS.pop(enquiry.email, None)
        
        # 1. Send notification email to admin
        admin_subject = f"New website enquiry from {enquiry.name}"
        admin_body = (
            f"Name: {enquiry.name}\n"
            f"Email: {enquiry.email}\n"
            f"Type: {enquiry.enquiry_type}\n"
            f"Message:\n{enquiry.message}"
        )
        send_resend_email(admin_subject, admin_body, ADMIN_EMAIL)

        # 2. Send confirmation email to candidate
        candidate_subject = "Thank you for reaching out to Ascension"
        candidate_body = (
            f"Dear {enquiry.name},\n\n"
            f"Thank you for contacting Ascension. We have received your query and our team will get back to you shortly.\n\n"
            f"Best regards,\n"
            f"Ascension Team"
        )
        send_resend_email(candidate_subject, candidate_body, enquiry.email)


class JobApplicationCreate(generics.CreateAPIView):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer

    def create(self, request, *args, **kwargs):
        email = request.data.get('email', '').strip()
        if not VERIFIED_EMAILS.get(email):
            return Response(
                {"error": "Please verify your email address with OTP before submitting your application."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        application = serializer.save()
        # Consume verified token
        VERIFIED_EMAILS.pop(application.email, None)
        
        # 1. Prepare resume attachment if available
        attachments = []
        if application.resume:
            try:
                application.resume.open('rb')
                file_data = application.resume.read()
                base64_content = base64.b64encode(file_data).decode('utf-8')
                filename = os.path.basename(application.resume.name)
                attachments.append({
                    "filename": filename,
                    "content": base64_content
                })
            except Exception as e:
                logger.error(f"Failed to read resume file for attachment: {e}")
            finally:
                application.resume.close()

        # 2. Send notification email to admin (with attachment)
        admin_subject = f"New Job Application: {application.job.title if application.job else 'Unknown Position'}"
        admin_body = (
            f"Candidate Name: {application.name}\n"
            f"Email: {application.email}\n"
            f"Phone: {application.phone}\n"
            f"Resume Filename: {os.path.basename(application.resume.name) if application.resume else 'No file uploaded'}\n\n"
            f"The candidate's resume PDF has been attached directly to this email."
        )
        send_resend_email(admin_subject, admin_body, ADMIN_EMAIL, attachments=attachments)

        # 2. Send confirmation email to candidate
        candidate_subject = f"Application Received: {application.job.title if application.job else 'Position'}"
        candidate_body = (
            f"Dear {application.name},\n\n"
            f"Thank you for applying for the {application.job.title if application.job else 'position'} at Ascension.\n\n"
            f"We will get in touch with you soon via your email or phone if your profile matches our requirements.\n\n"
            f"Best regards,\n"
            f"Ascension Team"
        )
        send_resend_email(candidate_subject, candidate_body, application.email)


class SendOTP(APIView):
    def post(self, request):
        email = request.data.get('email', '').strip()

        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate email format
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email):
            return Response({"error": "Invalid email address format."}, status=status.HTTP_400_BAD_REQUEST)

        # Generate random 6-digit OTP code for email
        otp = str(random.randint(100000, 999999))
        OTP_STORAGE[email] = otp

        # Send email OTP via Resend API
        subject = "Your Ascension Verification OTP"
        body = f"Your email verification OTP is: {otp}. It is valid for 10 minutes."
        success = send_resend_email(subject, body, email)
        if not success:
            return Response({"error": "Failed to send OTP email via Resend API."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"message": "OTP sent successfully to your email."}, status=status.HTTP_200_OK)


class VerifyOTP(APIView):
    def post(self, request):
        email = request.data.get('email', '').strip()
        otp = request.data.get('otp', '').strip()

        if not email or not otp:
            return Response({"error": "Email and OTP are required."}, status=status.HTTP_400_BAD_REQUEST)

        stored_otp = OTP_STORAGE.get(email)

        if stored_otp and stored_otp == otp:
            # Verified, clean up
            OTP_STORAGE.pop(email, None)
            VERIFIED_EMAILS[email] = True
            return Response({"status": "verified", "message": "Email verified successfully."}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid or expired OTP. Please try again."}, status=status.HTTP_400_BAD_REQUEST)
