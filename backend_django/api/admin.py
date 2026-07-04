from django.contrib import admin
from django.utils.html import format_html
from .models import JobOpening, Enquiry, JobApplication

@admin.register(JobOpening)
class JobOpeningAdmin(admin.ModelAdmin):
    list_display = ('title', 'experience', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('title', 'description')

@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'enquiry_type', 'submitted_at')
    list_filter = ('enquiry_type',)
    readonly_fields = ('submitted_at',)

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('name', 'job', 'email', 'phone', 'resume_link', 'submitted_at')
    list_filter = ('job',)
    search_fields = ('name', 'email', 'phone')

    def resume_link(self, obj):
        if obj.resume:
            return format_html('<a href="{0}" target="_blank" style="font-weight: bold; color: #10B981;" download>Download PDF</a>', obj.resume.url)
        return "No resume"
    resume_link.short_description = 'Resume (PDF)'