from PIL import Image
from io import BytesIO
from django.core.files.base import ContentFile

def webp_convertor(uploaded_image):
    image = Image.open(uploaded_image)
    image_io = BytesIO()
    image.save(image_io, format='WEBP', quality=80)
    webp_image = ContentFile(image_io.getvalue(), name=f"{uploaded_image.name.rsplit('.', 1)[0]}.webp")
    return webp_image
