# account/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    Custom User 모델: 이메일, 닉네임, 찜한 화장실 추가.
    """
    email = models.EmailField(unique=True)  # 이메일 필드 (유니크)
    nickname = models.CharField(max_length=50, unique=True)  # 닉네임 필드 (유니크)
    liked_toilets = models.ManyToManyField('toilet.Toilet', related_name='liked_by_users', blank=True)

    def __str__(self):
        return self.username
