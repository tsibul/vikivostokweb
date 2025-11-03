from django.shortcuts import render
from viki_web_cms.models.news_models import News

def news(request):
    """
    View for displaying news page
    """
    news_list = News.objects.filter(deleted=False).order_by('-date')
    return render(request, 'news.html', {
        'news_list': news_list
    })
