from rest_framework import serializers
from .models import JobOpening, Enquiry, JobApplication

class JobOpeningSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)  # Convert ObjectId to string representation

    class Meta:
        model = JobOpening
        fields = ['id', 'title', 'description', 'qualifications', 'experience', 'salary', 'is_active', 'created_at']

class EnquirySerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = Enquiry
        fields = ['id', 'name', 'email', 'enquiry_type', 'message', 'submitted_at']

class JobApplicationSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = JobApplication
        fields = ['id', 'job', 'name', 'email', 'phone', 'resume', 'submitted_at']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if 'job' in ret and ret['job']:
            ret['job'] = str(ret['job'])
        return ret
