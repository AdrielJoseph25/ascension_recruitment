from django.db import models

class JobOpening(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    qualifications = models.CharField(max_length=300)
    experience = models.CharField(max_length=100)
    salary = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Enquiry(models.Model):
    ENQUIRY_TYPES = (
        ('General', 'General Enquiry'),
        ('Recruitment', 'Recruitment'),
        ('Business', 'Business'),
    )
    name = models.CharField(max_length=150)
    email = models.EmailField()
    enquiry_type = models.CharField(max_length=20, choices=ENQUIRY_TYPES)
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.enquiry_type}"

class JobApplication(models.Model):
    job = models.ForeignKey(JobOpening, on_delete=models.CASCADE, related_name='applications')
    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    resume = models.FileField(upload_to='resumes/')
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.job.title if self.job else 'Unknown Job'}"