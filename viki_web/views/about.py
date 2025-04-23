"""
@fileoverview Module containing views for the about section of the website
@module about
"""

from django.shortcuts import render
from django.http import JsonResponse
from django.core.mail import send_mail
from django.conf import settings


def about(request):
    """
    Renders the about page.
    
    Args:
        request: HTTP request object
        
    Returns:
        Rendered about page
    """
    return render(request, 'about.html')


def news(request):
    """
    Renders the news page.
    
    Args:
        request: HTTP request object
        
    Returns:
        Rendered news page
    """
    return render(request, 'news.html')


def privacy(request):
    """
    Renders the privacy policy page.
    
    Args:
        request: HTTP request object
        
    Returns:
        Rendered privacy policy page
    """
    return render(request, 'privacy.html')


def legal(request):
    """
    Renders the legal information page.
    
    Args:
        request: HTTP request object
        
    Returns:
        Rendered legal information page
    """
    return render(request, 'legal.html')


def sitemap(request):
    """
    Renders the sitemap page.
    
    Args:
        request: HTTP request object
        
    Returns:
        Rendered sitemap page with all site sections
    """
    return render(request, 'sitemap.html')


def contacts(request):
    """
    Renders the contacts page and handles contact form submissions.
    
    Args:
        request: HTTP request object
        
    Returns:
        Rendered contacts page or JSON response for AJAX form submissions
    """
    context = {}
    
    if request.method == 'POST':
        # Extract form data
        name = request.POST.get('name', '')
        email = request.POST.get('email', '')
        phone = request.POST.get('phone', '')
        message = request.POST.get('message', '')
        
        # Verify simple captcha
        captcha_answer = request.POST.get('captcha_answer', '')
        captcha_expected = request.POST.get('captcha_expected', '')
        
        if not captcha_answer or captcha_answer != captcha_expected:
            # Failed captcha verification
            context['captcha_error'] = 'Неверный ответ на вопрос. Пожалуйста, попробуйте снова.'
            
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'message': 'Неверный ответ на вопрос. Пожалуйста, попробуйте снова.'
                })
            
            return render(request, 'contacts.html', context)
        
        # Create email message
        subject = f'Сообщение с сайта от {name}'
        email_message = f"""
            Имя: {name}
            Email: {email}
            Телефон: {phone}
            
            Сообщение:
            {message}
        """
        
        # Get recipient email from settings or use a default
        recipient_email = getattr(settings, 'CONTACT_EMAIL', 'office@vikivostok.ru')
        
        try:
            # Send email
            send_mail(
                subject,
                email_message,
                settings.DEFAULT_FROM_EMAIL,
                [recipient_email],
                fail_silently=False,
            )
            
            # If it's an AJAX request, return JSON response
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'message': 'Ваше сообщение успешно отправлено!'
                })
            
            # For non-AJAX requests, render the page with a success message
            context['success_message'] = 'Ваше сообщение успешно отправлено!'
            return render(request, 'contacts.html', context)
            
        except Exception as e:
            # If there's an error sending the email
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'message': 'Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.'
                })
            
            # For non-AJAX requests, render the page with an error message
            context['error_message'] = 'Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.'
            return render(request, 'contacts.html', context)
    
    # For GET requests, just render the contacts page
    return render(request, 'contacts.html', context) 