export function toggleActive(details, childList) {
    const summary = details.querySelector('summary');
    const hasTextActive = Array.from(childList).some(item => item.classList.contains('text-active'));
    hasTextActive ? summary.classList.add('text-active') : summary.classList.remove('text-active');
}