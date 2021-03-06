#!/usr/bin/env python

import os.path

from django.contrib.auth.models import User
from django.db import models
from django.utils.timezone import now 

class BaseUpload(models.Model):
    """
    Base class for any file uploaded to PANDA.
    """
    filename = models.CharField(max_length=256,
        help_text='Filename as stored in PANDA.')
    original_filename = models.CharField(max_length=256,
        help_text='Filename as originally uploaded.')
    size = models.IntegerField(
        help_text='Size of the file in bytes.')
    creator = models.ForeignKey(User,
        help_text='The user who uploaded this file.')
    creation_date = models.DateTimeField(
        help_text='The date this file was uploaded.')

    class Meta:
        app_label = 'panda'
        abstract = True

    def __unicode__(self):
        return self.filename

    def save(self, *args, **kwargs):
        if not self.creation_date:
            self.creation_date = now()

        super(BaseUpload, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """
        When deleting an upload, it will attempt to clean
        up its own associated files.
        """
        try:
            os.remove(self.get_path())
        except:
            pass

        super(BaseUpload, self).delete(*args, **kwargs)

    def get_path(self):
        """
        Get the absolute path to this upload on disk.
        """
        return os.path.join(self.file_root, self.filename)

