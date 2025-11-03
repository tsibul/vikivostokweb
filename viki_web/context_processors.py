"""
Context processors for adding common data to templates
"""
from viki_web_cms.models import ProductGroup, GoodsGroup

def common_data(request):
    """
    Adds common data to the context of all templates
    
    Args:
        request: HTTP request object
        
    Returns:
        Dictionary with common data
    """
    # Get product groups ordered by priority
    product_groups = ProductGroup.objects.filter(deleted=False).order_by('priority', 'name')
    
    # Get goods groups
    goods_groups = GoodsGroup.objects.filter(deleted=False).order_by('name')
    
    return {
        'footer_product_groups': product_groups,
        'footer_goods_groups': goods_groups,
    } 