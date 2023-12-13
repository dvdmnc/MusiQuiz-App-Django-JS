from django.db import models

# Create your models here.
class Singers(models.Model):
    name = models.CharField(max_length=64)
    face = models.ImageField(upload_to='images/')

    def __str__(self):
        # Return a string that represents the instance
        return f"Singer : {self.name}"
class Songs(models.Model):
    name = models.CharField(max_length=500)
    sample = models.FileField(upload_to = 'audio/', default='settings.MEDIA_ROOT/audio/_Richard-Cocciante-Le-Coup-de-Soleil.mp3')
    singer = models.ForeignKey(
        Singers,
        on_delete=models.CASCADE
    )
    def __str__(self):
        # Return a string that represents the instance
        return f"Song : {self.name} / {self.singer}"
    