'use strict';

export const companyHtml = `
            <details class="company" id="company-0">
                <summary class="personal-data__block">
                    <label for="company-name-0" class="personal-data__label">Название</label>
                    <input type="text" id="company-name-0" class="personal-data__input" disabled>
                </summary>
                <div class="personal-data__inputs">
                    <form id="company-0" class="personal-data__block">
                        <div class="personal-data__block">
                            <label for="inn-0" class="personal-data__label">ИНН</label>
                            <input type="text" id="inn-0"
                                   class="personal-data__input input-disabled"
                                   name="inn">
                        </div>
                        <div class="personal-data__block">
                            <label for="company-kpp-0" class="personal-data__label">КПП</label>
                            <input type="text" id="company-kpp-0" class="personal-data__input" disabled>
                        </div>
                        <div class="personal-data__block">
                            <input type="checkbox" id="vat-0"
                                   class="input-disabled"
                                   name="vat">
                            <label for="vat-0" class="personal-data__label">с НДС</label>
                        </div>
                    </form>
                    <div class="personal-data__block">
                        <label for="company-address-0" class="personal-data__label">Прайс-лист</label>
                        <input type="text" id="company-address-0" class="personal-data__input" disabled>
                    </div>
                    <h4 id="company-bank-0">Реквизиты</h4>
                </div>
                <div class="personal-data__inputs">
                        <div class="personal-data__change">
                            <button class="btn btn__neutral personal-btn"
                                    type="button"
                                    data-id="company-0">Изменить
                            </button>
                            <button class="btn btn__cancel personal-btn" type="button">Добавить</button>
                        </div>
                        <div class="personal-data__save item-hidden">
                            <button class="btn btn__save personal-btn"
                                    type="button"
                                    data-id="company-0">Сохранить
                            </button>
                            <button class="btn btn__cancel personal-btn"
                                    type="button" data-id="company-0">Отменить
                            </button>
                            <div class="alert"></div>
                        </div>
                    </div>
            </details>
`

export const bankHtml = `
                    <details class="bank personal-data__block" id="bank-0">
                        <summary class="personal-data__block">
                            <label for="bank-name-0" class="personal-data__label">Название</label>
                            <input type="text" id="bank-name-0" class="personal-data__input" disabled>
                        </summary>
                        <form>
                            <div class="personal-data__block">
                                <label for="account-0" class="personal-data__label">Счет</label>
                                <input type="text" id="account-0"
                                       class="personal-data__input input-disabled"
                                       name="account_no">
                            </div>
                            <div class="personal-data__block">
                                <label for="bic-0" class="personal-data__label">БИК</label>
                                <input type="text" id="bic-0"
                                       class="personal-data__input input-disabled"
                                       name="bic">
                            </div>
                            <div class="personal-data__block">
                                <label for="cor-account-0" class="personal-data__label">Название</label>
                                <input type="text" id="cor-account-0" class="personal-data__input" disabled>
                            </div>
                        </form>
                    </details>
`