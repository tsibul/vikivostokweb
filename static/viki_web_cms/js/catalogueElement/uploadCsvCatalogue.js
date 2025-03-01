'use strict'

export async function uploadCsvCatalogue(e) {
    e.preventDefault();
    const form = e.target.closest('form');
    const formData = new FormData(form);
    const fileName = Object.fromEntries(formData.entries()).csv_file.name;
    if (!fileName.endsWith('.csv')){
        form.querySelector('input').value = '';
    } else {
    console.log(fileName);

    }
    console.log('mmm');

}