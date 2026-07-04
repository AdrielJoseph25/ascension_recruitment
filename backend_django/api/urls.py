from django.urls import path
from .views import JobOpeningList, EnquiryCreate, JobApplicationCreate, SendOTP, VerifyOTP

urlpatterns = [
    path('jobs/', JobOpeningList.as_view(), name='job-list'),
    path('enquiries/', EnquiryCreate.as_view(), name='enquiry-create'),
    path('applications/', JobApplicationCreate.as_view(), name='application-create'),
    path('send-otp/', SendOTP.as_view(), name='send-otp'),
    path('verify-otp/', VerifyOTP.as_view(), name='verify-otp'),
]
