from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.mail import send_mail
import logging
import random
import re

from .models import JobOpening, Enquiry, JobApplication
from .serializers import JobOpeningSerializer, EnquirySerializer, JobApplicationSerializer

logger = logging.getLogger(__name__)

# Cache for OTP codes and verified email flags
OTP_STORAGE = {}
VERIFIED_EMAILS = {}

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
        try:
            send_mail(admin_subject, admin_body, 'no-reply@ascension.net.in', ['adriel.joseph2506@gmail.com'], fail_silently=False)
        except Exception as e:
            logger.error(f"Failed to send admin enquiry mail: {e}")

        # 2. Send confirmation email to candidate
        candidate_subject = "Thank you for reaching out to Ascension"
        candidate_body = (
            f"Dear {enquiry.name},\n\n"
            f"Thank you for contacting Ascension. We have received your query and our team will get back to you shortly.\n\n"
            f"Best regards,\n"
            f"Ascension Team"
        )
        try:
            send_mail(candidate_subject, candidate_body, 'no-reply@ascension.net.in', [enquiry.email], fail_silently=False)
        except Exception as e:
            logger.error(f"Failed to send candidate enquiry mail: {e}")


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
        
        # 1. Send notification email to admin
        admin_subject = f"New Job Application: {application.job.title if application.job else 'Unknown Position'}"
        admin_body = (
            f"Candidate Name: {application.name}\n"
            f"Email: {application.email}\n"
            f"Phone: {application.phone}\n"
            f"Resume URL: {application.resume.url if application.resume else 'No file uploaded'}"
        )
        try:
            send_mail(admin_subject, admin_body, 'no-reply@ascension.net.in', ['adriel.joseph2506@gmail.com'], fail_silently=False)
        except Exception as e:
            logger.error(f"Failed to send admin application mail: {e}")

        # 2. Send confirmation email to candidate
        candidate_subject = f"Application Received: {application.job.title if application.job else 'Position'}"
        candidate_body = (
            f"Dear {application.name},\n\n"
            f"Thank you for applying for the {application.job.title if application.job else 'position'} at Ascension.\n\n"
            f"We will get in touch with you soon via your email or phone if your profile matches our requirements.\n\n"
            f"Best regards,\n"
            f"Ascension Team"
        )
        try:
            send_mail(candidate_subject, candidate_body, 'no-reply@ascension.net.in', [application.email], fail_silently=False)
        except Exception as e:
            logger.error(f"Failed to send candidate application mail: {e}")


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

        # Send email OTP via Django mail
        subject = "Your Ascension Verification OTP"
        body = f"Your email verification OTP is: {otp}. It is valid for 10 minutes."
        try:
            send_mail(subject, body, 'no-reply@ascension.net.in', [email], fail_silently=False)
        except Exception as e:
            logger.error(f"Failed to send email OTP: {e}")
            return Response({"error": f"Failed to send OTP email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
