'use strict';

export const companyHtml = `
            <details class="company" id="company-detail-0">
                <summary class="company__summary">
                        <div class="personal-data__block">
                            <label for="company-name-0" class="personal-data__label"></label>
                            <input type="text" id="company-name-0" 
                                   class="personal-data__input"
                                   data-name="name"
                                   disabled>
                        </div>
                        <div class="personal-data__change legal-data__change">
                                    <button class="btn btn__neutral legal-btn"
                                            type="button"
                                            data-id="company-0">Изменить НДС
                                    </button>
                        </div>
                        <div class="personal-data__save company__data-save item-hidden">
                            <div class="company__save">
                                <button class="btn btn__save personal-btn"
                                        type="button"
                                        data-id="company-0">Сохранить
                                </button>
                                <button class="btn btn__cancel personal-btn"
                                        type="button" data-id="company-0">Отменить
                                </button>
                            </div>
                            <div class="alert company-alert"></div>
                        </div>
                </summary>
                <div class="legal-data__inputs">
                    <div class="personal-data__inputs">
                        <form id="company-0" class="legal-data__block">
                        <input type="text" data-name="id" name="id" hidden>
                            <div class="personal-data__block">
                                <label for="inn-0" class="personal-data__label">ИНН</label>
                                <input type="text" id="inn-0"
                                       class="personal-data__input"
                                       name="inn"
                                       data-name="inn"
                                       disabled>
                            </div>
                            <div class="personal-data__block">
                                <label for="company-kpp-0" class="personal-data__label">КПП</label>
                                <input type="text" 
                                       id="company-kpp-0" 
                                       class="personal-data__input" 
                                       data-name="kpp" 
                                       disabled>
                            </div>
                            <div class="personal-data__block">
                                <input type="checkbox" id="company-vat-0"
                                       class="input-disabled check"
                                       name="vat" 
                                       data-name="vat">
                                <label for="vat-0" class="personal-data__label">с НДС</label>
                            </div>
                        </form>
                        <div class="personal-data__block">
                            <label for="company-address-0" class="personal-data__label">Адрес</label>
                            <input type="text" 
                                   id="company-address-0" 
                                   class="personal-data__input" 
                                   data-name="address" 
                                   disabled>
                        </div>
                        <div class="legal-data__title">
                            <h4>Банковские реквизиты</h4>
                            <div></div>
                            <button class="btn btn__cancel legal-btn" type="button" id="new-bank">Добавить</button>
                        </div>
                        <div id="company-bank-0"></div>
                    </div>
                    <div class="personal-data__inputs">
            </details>
`

export const bankHtml = `
                    <hr>
                    <details class="bank " id="bank-0">
                        <summary class="">
<!--                            <label for="bank-name-0" class="personal-data__label">Название</label>-->
<!--                            <p>-->
                            <input type="text" 
                            id="bank-name-0" 
                            class="bank__name"
                            data-name="name" 
                            disabled>
<!--                            </p>-->
                        </summary>
                        <form class="legal-data__inputs">
                        <input type="text" data-name="id" name="id" hidden>
                        <div class="personal-data__inputs">
                            <div class="personal-data__block">
                                <label for="account-0" class="personal-data__label">Счет</label>
                                <input type="text" id="account-0"
                                       class="personal-data__input input-disabled"
                                       name="account_no" 
                                       data-name="account_no">
                            </div>
                            <div class="legal-data__block">
                                <div class="personal-data__block">
                                    <label for="bic-0" class="personal-data__label">БИК</label>
                                    <input type="text" id="bic-0"
                                           class="personal-data__input input-disabled"
                                           name="bic" 
                                           data-name="bic">
                                </div>
                                <div class="personal-data__block">
                                    <label for="city-0" class="personal-data__label">Город</label>
                                    <input type="text" id="city" 
                                           class="personal-data__input" 
                                           data-name="city"
                                           disabled>
                                </div>
                            </div>
                            <div class="personal-data__block">
                                <label for="corr-account-0" class="personal-data__label">Кор. счет</label>
                                <input type="text" 
                                       id="corr-account-0" 
                                       class="personal-data__input" 
                                       data-name="corr_account" 
                                       disabled>
                            </div>
                        </div>
                        <div class="personal-data__inputs">
                            <div class="personal-data__change legal-data__change">
                                <button class="btn btn__neutral legal-btn"
                                    type="button"
                                    data-id="company-0">Изменить
                                </button>
                            </div>
                            <div class="personal-data__save item-hidden">
                            <button class="btn btn__save personal-btn"
                                    type="button"
                                    data-id="company-0">Сохранить
                            </button>
                            <button class="btn btn__cancel personal-btn"
                                    type="button" data-id="company-0">Отменить
                            </button>
                            <div class="alert company-alert"></div>
                        </div>
                        </div>

                        </form>
                    </details>
`