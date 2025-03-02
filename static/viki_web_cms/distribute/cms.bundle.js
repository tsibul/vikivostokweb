(()=>{"use strict";var e={d:(t,n)=>{for(var a in n)e.o(n,a)&&!e.o(t,a)&&Object.defineProperty(t,a,{enumerable:!0,get:n[a]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)};function t(e){e.close(),e.remove()}function n(e,n,a){const c=document.createElement("div");c.classList.add("modal__header");let d=n;d="0"===a?"Создать "+d:"Изменить "+d;const o=document.createElement("div");o.textContent=d,c.appendChild(o);const i=document.createElement("button");return i.classList.add("modal__header_btn"),i.textContent="×",i.addEventListener("click",(n=>{n.preventDefault(),t(e)})),c.appendChild(i),c}function a(e){const t=document.createElement("button");return t.classList.add("btn","btn__cancel"),t.textContent=e,t}function c(e){const t=document.createElement("button");return t.classList.add("btn","btn__save"),t.textContent=e,t}function d(e,n){const d=document.createElement("div");d.classList.add("modal__button-block");const o=a("Отменить");o.type="button",o.addEventListener("click",(n=>{n.preventDefault(),t(e)}));const i=c("Записать");return i.type="button",i.classList.add("submit"),i.dataset.id=n,d.appendChild(o),d.appendChild(i),d}function o(e){let t,n,a=!1;e.querySelector(".modal__header").addEventListener("mousedown",(c=>{a=!0,t=c.clientX-e.offsetLeft,n=c.clientY-e.offsetTop,e.style.cursor="grabbing"})),document.addEventListener("mousemove",(c=>{a&&(e.style.left=c.clientX-t+"px",e.style.top=c.clientY-n+"px")})),document.addEventListener("mouseup",(()=>{a=!1,e.style.cursor="grab"}))}function i(e){return fetch(e).then((e=>e.json()))}function l(e){const t=document.createElement("input");return t.type=e,t.classList.add("modal__content_"+e),t}async function s(e,t,n){const a=document.createElement("div");a.classList.add("dropdown");const c=l("text"),d=document.createElement("input");d.hidden=!0,d.type="text",c.classList.add("dropdown__input"),a.appendChild(c),a.appendChild(d),a.insertAdjacentHTML("beforeend",'<i class="fa-solid fa-chevron-down dropdown__input_icon"></i>');const o=document.createElement("ul");o.classList.add("dropdown__list","invisible");const s=V+"dropdown_list/"+e,u=await i(s);if(t){let e=u.find((e=>e.id===t));c.value=e.value,d.value=e.id}else u[0]&&!n&&(c.value=u[0].value,d.value=u[0].id);return r(u,o,c,d,n),c.addEventListener("click",(()=>{o.classList.toggle("invisible")})),a.appendChild(o),c.addEventListener("keyup",(e=>{let t=e.target.value.toUpperCase();const n=u.filter((e=>e.value.toUpperCase().indexOf(t)>-1));o.innerHTML="",r(n,o,c,d)})),a}function r(e,t,n,a,c){c&&u({id:"",value:""},t,n,a),e.forEach((e=>{u(e,t,n,a)}))}function u(e,t,n,a){const c=document.createElement("li");c.classList.add("dropdown__list_item"),c.value=e.id,c.textContent=e.value,c.addEventListener("click",(e=>{n.value=e.target.textContent,a.value=e.target.value,a.dispatchEvent(new Event("change",{bubbles:!0})),t.classList.add("invisible")})),t.appendChild(c)}function m(e,t,n){const a=document.createElement("input");return a.type=e,a.name=t,"id"===t.slice(-2)&&(a.hidden=!0),"checkbox"===e?(a.checked=n,a.classList.add("check","catalogue__check")):(a.value=n,a.readOnly=!0,a.classList.add("catalogue__input")),a}function p(e,t){t.value=JSON.stringify(e)}function _(e){const t=e.target.closest("form").querySelector('input[type="file"]');t.value="",t.dispatchEvent(new Event("change",{bubbles:!0}))}async function f(e,t){t.enctype="multipart/form-data",t.classList.add("catalogue","catalogue__row"),t.appendChild(m("number","id",e.id));const n=m("checkbox","deleted",e.deleted);n.addEventListener("change",(e=>function(e){const t=e.target.closest("form");if(t.querySelector("textarea").value){const e=t.querySelector(".btn__save");e.disabled=!1,e.classList.remove("btn__disabled");const n=t.querySelector(".btn__cancel");n.disabled=!1,n.classList.remove("btn__disabled")}}(e))),t.appendChild(n);const d=document.createElement("textarea");d.value=e.name,d.name="name",d.classList.add("catalogue__input"),d.readOnly=!0,t.appendChild(d),t.appendChild(m("text","item_article",e.item_article));const o=document.createElement("div");o.classList.add("catalogue__input","main_color_text"),o.textContent=e.main_color_text,t.appendChild(o),t.appendChild(m("text","main_color__id",e.main_color__id)),t.appendChild(m("number","goods_option__id",e.goods_option__id));const l=document.createElement("div");l.classList.add("catalogue__input","goods_option__name"),l.textContent=e.goods_option__name,t.appendChild(l);const r=document.createElement("img");r.classList.add("catalogue__img"),r.alt=e.item_article,r.src="/static/viki_web_cms/files/item_photo/"+e.image,t.appendChild(r);const u=m("checkbox","simple_article",e.simple_article);0===e.id&&(u.checked=!0),u.addEventListener("change",(e=>_(e))),t.appendChild(u);const h=await s("Goods",e.goods__id,!1);t.appendChild(h);const y=h.querySelector("input[hidden]");y.name="goods__id",y.addEventListener("change",(e=>_(e)));const v=document.createElement("div");v.classList.add("catalogue__file");const g=document.createElement("div");g.textContent=e.image,g.classList.add("catalogue__file_text"),v.appendChild(g);const b=document.createElement("div");b.classList.add("catalogue__input-frame");const C=document.createElement("input");C.classList.add("catalogue__file_input"),C.type="file",C.name="image",C.accept="image/png, image/jpeg, image/jpg",C.addEventListener("change",(async e=>await async function(e,t,n,a,c){const d=e.target.closest("form"),o=d.querySelector('input[name="id"]'),l=d.querySelector('input[name="colors"]'),s=d.querySelector('input[name="goods_option__id"]'),r=d.querySelector('textarea[name="name"]'),u=d.querySelector('input[name="item_article"]'),m=d.querySelector('input[name="main_color__id"]'),_=d.querySelector(".main_color_text"),f=d.querySelector(".goods_option__name"),h=d.querySelector(".btn__save");function y(){t.textContent="",c.src="",r.value="",u.value="",m.value="",_.textContent="",s.value="",f.textContent="",l.value="",h.disabled=!0,h.classList.contains("btn__disabled")||h.classList.add("btn__disabled")}if(l.value="",s.value="",/(\.jpg|\.jpeg|\.png)$/i.exec(e.target.value)){const d=e.target.files[0],v=new FileReader;v.onload=function(e){c.src=e.target.result},v.readAsDataURL(d),t.textContent=e.target.value.split("\\").pop();const g=t.textContent.split(".")[0],b=V+"parse_file_data/"+n+"/"+a+"/"+g+"/"+o.value,C=await i(b);C.error?y():(r.value=C.values.name,u.value=C.values.item_article,m.value=C.values.main_color__id,_.textContent=C.values.main_color_text,s.value=C.values.goods_option__id,f.textContent=C.values.goods_option__name,p(C.values.colors,l),h.disabled=!1,h.classList.remove("btn__disabled"))}else e.target.value="",y()}(e,g,y.value,u.checked?1:0,r))),b.appendChild(C),v.appendChild(b),t.appendChild(v);const E=document.createElement("div");E.classList.add("catalogue__btn-block");const L=c("");L.disabled=!0,L.classList.add("tooltip","btn__disabled"),L.innerHTML='<i class="catalogue__icon fa-solid fa-check"></i><span class="tooltip-text">сохранить</span>',L.addEventListener("click",(e=>async function(e,t){t.disabled=!0,t.classList.add("btn__disabled");const n=t.closest("form"),a=n.querySelector('input[name="id"]').value,c=document.querySelector(".catalogue__title").querySelector(".btn__save");c.disabled=!1,c.classList.remove("btn__disabled");const d=new FormData(n),o=Object.fromEntries(d.entries());let l=!1;if("0"!==a){const e=V+"catalogue_record/"+a,t=await i(e);for(const e in o)if(t.values[0][e]!==o[e]){l=!0;break}}if("0"===a||l){e.preventDefault();const t=V+"save_catalogue_item/"+a;await fetch(t,{method:"POST",body:d}).then((e=>e.json())).then((e=>{"0"===a&&(n.querySelector('input[name="id"]').value=e.id);const t=n.querySelector(".btn__cancel");t.disabled=!0,t.classList.add("btn__disabled")}))}}(e,L)));const w=a("");w.classList.add("tooltip","btn__disabled"),w.disabled=!0,w.innerHTML='<i class="catalogue__icon fa-solid fa-x"></i><span class="tooltip-text">отменить</span>',w.addEventListener("click",(e=>async function(e){const t=e.target.closest("form"),n=t.querySelector('input[name="id"]').value;if("0"===n){t.remove();const e=document.querySelector(".catalogue__title").querySelector(".btn__save");e.disabled=!1,e.classList.remove("btn__disabled")}else{t.innerHTML="";const e=V+"catalogue_record/"+n,a=await i(e);await f(a.values[0],t)}}(e))),E.appendChild(L),E.appendChild(w),t.appendChild(E);const x=m("text","colors","");x.hidden=!0,t.appendChild(x),e.colors&&p(e.colors,x)}function h(e){let t=e;return function(e){return/^[a-zA-Zа-яА-ЯёЁ0-9 ._#]*$/.test(e)}(e)&&e||(t="None"),t.replace(/ /g,"|")}async function y(e){const t=e.target,n=t.dataset.lastId,a=t.closest(".content"),c=a.querySelector(".dictionary-frame__input").value,d=a.querySelector(".check"),o=a.querySelector(".catalogue__content");await v(o,d.checked?1:0,n,h(c),0)}async function v(e,t,n,a,c){const d=V+"catalogue_data/"+t+"/"+n+"/"+a+"/"+c,o=(await i(d)).values;let l,s=0;const r=e.querySelector(`form[data-last-id="${n}"]`);r&&r.removeEventListener("mouseover",y);for(const t of o)l=document.createElement("form"),await f(t,l),e.appendChild(await l),s++,20===s&&(l.dataset.lastId=Number.parseInt(n)+s,l.addEventListener("mouseover",y))}async function g(e,t,n){const a=e.querySelector(".catalogue__content");a.innerHTML="",await v(a,t.checked?0:1,0,n,0)}function b(){const e=document.createElement("details");return e.classList.add("alert__details"),e}function C(e,t){const n=document.createElement("summary");return n.classList.add("alert__summary"),n.textContent=e+" "+t,n}function E(e){const t=document.createElement("div");t.classList.add("alert__element");const n=document.createElement("div");n.textContent="артикул";const a=document.createElement("div");a.textContent=e.item;const c=document.createElement("div");c.textContent="результат";const d=document.createElement("div");return d.textContent=e.message,t.appendChild(n),t.appendChild(a),t.appendChild(c),t.appendChild(d),t}async function L(e){e.preventDefault();const n=document.querySelector(".content"),a=h(n.querySelector(".dictionary-frame__input").value),d=n.querySelector(".check"),i=e.target.closest("form"),l=i.querySelector(".error-message"),s=e.target.closest("dialog"),r=new FormData(i);if(Object.fromEntries(r.entries()).csv_file.name.endsWith(".csv")){const e=V+"catalogue_csv_load";await fetch(e,{method:"POST",body:r}).then((e=>e.json())).then((e=>{if(e.error)i.querySelector("input").value="",l.style.display="block",l.textContent=e.error;else{t(s),g(n,d.checked?1:0,a);const i=function(e){const t=document.createElement("dialog");t.classList.add("alert");const n=document.createElement("header");n.classList.add("modal__header");const a=document.createElement("h4");a.textContent="Результат загрузки",n.appendChild(a);const d=document.createElement("div");d.innerHTML="&times;",d.addEventListener("click",(()=>{t.remove()})),n.appendChild(d),t.appendChild(n);const o=b(),i=C("Ошибки",e.recordErrorLength);o.appendChild(i),e.recordError.forEach((e=>{o.appendChild(E(e))})),t.appendChild(o);const l=b(),s=C("Дубли",e.recordDoubleLength);l.appendChild(s),e.recordDouble.forEach((e=>{l.appendChild(E(e))})),t.appendChild(l);const r=b(),u=C("Успешно",e.recordSuccessLength);r.appendChild(u),e.recordSuccess.forEach((e=>{r.appendChild(E(e))})),t.appendChild(r);const m=c("Ok");return m.classList.add("alert__btn"),m.addEventListener("click",(()=>{t.remove()})),t.appendChild(m),t}(e);document.querySelector(".service").appendChild(i),i.showModal(),o(i)}}))}else i.querySelector("input").value="",l.style.display="block",l.textContent="Неправильный формат файла";console.log("mmm")}function w(){const e=document.createElement("div");return e.classList.add("dictionary-content__square"),e}async function x(e){const t=V+"field_names/"+e;return await i(t)}function S(e){const t=document.createElement("label");return t.classList.add("modal__content_label"),t.htmlFor=e.field+"Input",t.textContent=e.label,t}e.d({},{G:()=>H,e:()=>V});const k={string:function(e){const t=l("text");return t.value=e.fieldValue,t.name=e.fieldName.field,t},boolean:function(e){const t=l("checkbox");return t.checked=e.fieldValue,t.id=e.fieldName.field+"Input",t.name=e.fieldName.field,t},number:function(e){const t=l("number");return t.value=e.fieldValue,t.name=e.fieldName.field,t},foreign:async function(e){const t=e.fieldName.foreignClass,n=e.fieldValue,a=await s(t,n,e.fieldName.null);return a.querySelector("[hidden]").name=e.fieldName.field+"_id",a},image:function(e){const t=document.createElement("img");return t.classList.add("modal__content_image"),t.src=e.url+e.fieldValue,t.alt=e.fieldName.field,t},file:function(e){const t=document.createElement("div");t.classList.add("modal__content_file-frame");const n=l("file");return n.placeholder=e.fieldValue,n.name=e.fieldName.field,t.appendChild(n),t}};function q(e){let t="14px 6fr ";return e.forEach((e=>{"name"!==e.field&&("boolean"===e.type||"number"===e.type?t+="1fr ":t+="3fr ")})),t+="80px",t}async function N(e,t,n,a,c){const d=document.createElement("div");d.classList.add("dictionary-content__rows");const o=V+"field_values/"+e+"/"+t+"/"+n+"/"+a,l=await i(o);let s=0;return l.values.forEach((o=>{let i=document.createElement("div");O(i,o,l.field_params,e),i.style.gridTemplateColumns=c,d.appendChild(i),s++,20===s&&(i.dataset.lastRecord=n+20,i.addEventListener("mouseover",(c=>async function(e,t,n,a,c){const d=q(await x(t)),o=e.closest(".dictionary-content__rows");[...(await N(t,n,c,a,d)).children].forEach((e=>{o.appendChild(e)}));const i=e.cloneNode(!0);e.parentNode.replaceChild(i,e)}(c.target,e,t,a,n+20))))})),d}function O(e,t,n,c){e.classList.add("dictionary-content__row");const d=w();t.hex&&(d.style.backgroundColor=t.hex),e.appendChild(d),e.id=c+"_row_"+t.id,Object.keys(t).forEach(((a,c)=>{if("id"!==a){let c;Object.keys(n).includes(a)&&"image"===n[a].type?(c=document.createElement("img"),c.classList.add("dictionary-content__row_img"),c.src=n[a].url+t[a],c.alt=t[a]):Object.keys(n).includes(a)&&"boolean"===n[a].type?(c=document.createElement("input"),c.type="checkbox",c.checked=t[a],c.disabled=!0,c.classList.add("dictionary-content__check")):(c=document.createElement("div"),c.classList.add("dictionary-content__row_item"),c.textContent=t[a]),e.appendChild(c)}}));const o=a("Изм.");o.dataset.itemId=t.id,o.addEventListener("click",(e=>j(e))),e.appendChild(o)}async function j(e){e.preventDefault();const a=e.target.closest(".dictionary-content").parentElement.querySelector(".dictionary-frame__header"),c=a.dataset.class,l=a.dataset.title,s=await async function(e,a,c){const o=document.createElement("dialog");o.classList.add("modal"),o.addEventListener("keypress",(e=>{"Escape"===e.key&&t(o)}));const l=n(o,a,c);o.appendChild(l);const s=document.createElement("form");s.id=e+"__form",s.classList.add("modal__form"),s.enctype="multipart/form-data";const r=await async function(e,t,n){const a=document.createElement("div");a.classList.add("modal__content");const c=await x(t);let d;const o=V+"record_info/"+t+"/"+n,l=await i(o);for(const e of c){let t={fieldName:e,fieldValue:null,url:l.url};"0"!==n&&("foreign"!==e.type?t.fieldValue=l.record[e.field]:t.fieldValue=l.record[e.field+"_id"]),a.appendChild(S(e)),d=await k[e.type](t),a.appendChild(d)}return a}(0,e,c);s.appendChild(r),s.appendChild(d(o,c)),o.appendChild(s);const u=new FormData(s);return s.querySelector(".submit").addEventListener("click",(n=>async function(e,n,a,c){e.preventDefault();const d=e.target.dataset.id,o=n.closest(".modal");o.querySelectorAll("input").forEach((e=>{e.classList.remove("border-alert")})),e.target.disabled=!0;const i=new FormData(n);if(!function(e,t){const n=Array.from(t.values()),a=Array.from(e.values());return n.sort(),a.sort(),JSON.stringify(n)===JSON.stringify(a)}(i,c)){const n=V+"edit_dictionary/"+a+"/"+d;await fetch(n,{method:"POST",body:i}).then((e=>e.json())).then((n=>{const c=n.errors;if(c){let t;c.forEach((n=>{e.target.disabled=!1,t=o.querySelector(`[name = "${n}"]`),t.hidden?t.previousElementSibling.classList.add("border-alert"):t.classList.add("border-alert"),e.target.focus()}))}else{let e;if("0"!==d)e=document.querySelector("#"+a+"_row_"+d),e.innerHTML="";else{let t;e=document.createElement("div"),e.id=a+"_row_"+n.values.id,e.classList.add("dictionary-content__row"),t=document.getElementById(a)?document.getElementById(a).querySelector(".dictionary-content__rows"):document.querySelector(".dictionary-content__rows"),t.insertAdjacentElement("afterbegin",e),e.style.gridTemplateColumns=t.closest(".dictionary-content").dataset.grid}O(e,n.values,n.params,a),e.scrollIntoView({behavior:"smooth"}),e.focus(),t(o)}}))}}(n,s,e,u))),o}(c,l,e.target.dataset.itemId);document.querySelector(".service").appendChild(s),s.showModal(),o(s),console.log()}async function T(e,t,n,a){const c=await x(e),d=document.createElement("div");d.classList.add("dictionary-content");const o=await async function(e){const t=document.createElement("div");t.classList.add("dictionary-content__title","dictionary-content__row"),t.appendChild(w()),e.forEach((e=>{let n=document.createElement("div");n.classList.add("dictionary-content__title_item"),n.textContent=e.label,t.appendChild(n)}));const n=document.createElement("button");return n.classList.add("btn","btn__save"),n.textContent="Создать",n.dataset.itemId="0",n.addEventListener("click",(e=>j(e))),t.appendChild(n),t}(c);o.style.gridTemplateColumns=t,d.appendChild(o);const i=await N(e,n,0,a,t);return d.appendChild(i),d.dataset.grid=t,d}async function D(e,t,n,a){let c=e.querySelector(".dictionary-content");const d=c.dataset.grid;c.remove(),c=await T(t,d,n.checked?0:1,a),e.appendChild(c)}async function I(e,t){const n=e.closest(".dictionary-frame__header").parentElement,a=n.querySelector(".dictionary-frame__input").value,c=n.querySelector(".check");"Catalogue"===t?await g(n,c,h(a)):await D(n,t,c,h(a))}function M(e,i,l){const s=document.createElement("div");s.classList.add("dictionary-frame__header");const r=document.createElement("div");r.classList.add("dictionary-frame__header_left"),r.textContent=i,s.appendChild(r);const u=document.createElement("div");if(u.classList.add("dictionary-frame__header_right"),l){const a=function(){const e=document.createElement("button");return e.classList.add("btn","btn__neutral"),e.textContent="Загрузить",e}();a.addEventListener("click",(()=>async function(e){"Catalogue"===e&&function(){const e=document.querySelector(".service"),a=document.createElement("dialog");a.classList.add("catalogue__modal"),a.addEventListener("keypress",(e=>{"Escape"===e.key&&t(a)}));const c=n(a,"",0);a.appendChild(c);const i=document.createElement("form");i.id="catalogueDialog",i.classList.add("modal__form"),i.enctype="multipart/form-data";const l=document.createElement("div");l.classList.add("catalogue__input-frame");const s=document.createElement("input");s.classList.add("catalogue__modal_file-input"),s.type="file",s.name="csv_file",s.accept=".csv",l.appendChild(s),i.appendChild(l);const r=document.createElement("div");r.classList.add("error-message"),r.textContent="Error",i.appendChild(r),i.appendChild(d(a,0)),a.appendChild(i),i.querySelector(".submit").addEventListener("click",L),e.appendChild(a),c.firstElementChild.textContent="Загрузить csv файл",s.addEventListener("change",(()=>{r.textContent="",r.style.display="none"})),a.showModal(),o(a)}()}(e))),u.appendChild(a)}const m=function(){const e=document.createElement("input");return e.type="checkbox",e.checked=!0,e.classList.add("check"),e}();m.id=e+"-deleted",m.addEventListener("change",(()=>async function(e,t){const n=t.closest(".dictionary-frame__header").parentElement,a=h(n.querySelector(".dictionary-frame__input").value);"Catalogue"===e?await g(n,t,a):await D(n,e,t,a)}(e,m))),u.appendChild(m);const p=document.createElement("label");p.htmlFor=e+"-deleted",p.classList.add("dictionary-frame__label"),p.textContent="скрыть удаленные",u.appendChild(p),u.insertAdjacentHTML("beforeend",'<i class="fa fa-solid fa-magnifying-glass"></i>');const _=document.createElement("input");_.classList.add("dictionary-frame__input"),_.type="text",_.placeholder="поиск...",_.addEventListener("keypress",(t=>{"Enter"===t.key&&I(t.target,e)})),u.appendChild(_);const f=c("Поиск");f.addEventListener("click",(t=>I(t.target,e)));const y=a("Очистить");return y.addEventListener("click",(t=>async function(e,t){const n=e.closest(".dictionary-frame__header").parentElement;n.querySelector(".dictionary-frame__input").value="";const a=n.querySelector(".check");"Catalogue"===t?await g(n,a,"None"):await D(n,t,a,"None")}(t.target,e))),u.appendChild(f),u.appendChild(y),s.appendChild(u),s.dataset.class=e,s.dataset.title=i,s}const A=[{field:"deleted",type:"boolean",label:"уд."},{field:"name",type:"string",label:"название",null:!1},{field:"item_article",type:"string",label:"артикул",null:!1},{field:"main_color",type:"foreign",label:"осн. цвет",foreignClass:"Color",null:!1},{field:"goods_option",type:"foreign",label:"опция",foreignClass:"GoodsOption",null:!1},{field:"image",type:"img",label:"фото",url:"/static/viki_web_cms/files/item_photo/",null:!0},{field:"simple_article",type:"boolean",label:"ст. арт."},{field:"goods",type:"foreign",label:"номенклатура",foreignClass:"Goods",null:!1},{field:"image_file",type:"file",label:"файл",null:!0}],V="./json/",H={Goods:async function(e){const t="14px 4fr 1fr 1.5fr 1fr 3fr 3fr 3fr 2fr 2fr 1fr 1fr 3fr 1.5fr",n=await T(e,t,0,"None");return n.id=e,n.dataset.grid=t,n},Catalogue:async function(e){const t=document.createElement("div"),n=document.createElement("div");let a;n.classList.add("catalogue","catalogue__title"),A.forEach((e=>{a=document.createElement("p"),a.classList.add("catalogue__title-item"),a.textContent=e.label,n.appendChild(a)}));const d=c("Новый");d.addEventListener("click",(async e=>{e.target.disabled=!0,e.target.classList.add("btn__disabled");const t=document.createElement("form");await f({id:0},t);const n=t.querySelector(".btn__cancel");n.disabled=!1,n.classList.remove("btn__disabled"),o.insertAdjacentElement("afterbegin",t),t.scrollIntoView({behavior:"smooth"}),t.focus()})),n.appendChild(d),t.appendChild(n);const o=document.createElement("div");return o.classList.add("catalogue__content"),await v(o,0,0,"None",0),t.appendChild(o),t},PriceList:async function(e){return document.createElement("div")}},F=document.querySelectorAll(".menu__item"),J=document.querySelector(".content");F.forEach((e=>{e.addEventListener("click",(async t=>{e.classList.contains("menu__item_bold")||(e.classList.add("menu__item_bold"),J.innerHTML="","Standard"===t.target.dataset.page?function(e,t){e.style.flexDirection="row";const n=document.createElement("div");n.classList.add("content__left"),e.appendChild(n);const a=document.createElement("div");a.classList.add("content__right"),e.appendChild(a),JSON.parse(t).forEach((e=>{let t=document.createElement("details");t.classList.add("section-left");let a=document.createElement("summary");a.textContent=e.section_name,t.appendChild(a),e.cms_settings.forEach((e=>{let n=document.createElement("li");n.textContent=e.setting,n.dataset.class=e.setting_class,n.dataset.upload=e.upload,n.classList.add("section-left__content"),t.appendChild(n)}));const c=t.querySelectorAll("li");c.forEach((e=>{e.addEventListener("click",(()=>async function(e,t,n,a,c){if(e.classList.toggle("text-active"),document.getElementById(t))document.getElementById(t).classList.toggle("invisible");else{const a=document.querySelector(".content__right"),c=await async function(e,t,n){const a=document.createElement("section");a.classList.add("dictionary-frame"),a.id=e;const c=M(e,t,n);return a.appendChild(c),a}(t,e.textContent,n),d=q(await x(t)),o=await T(t,d,0,"None");c.appendChild(o),a.appendChild(c)}!function(e,t){const n=e.querySelector("summary");Array.from(t).some((e=>e.classList.contains("text-active")))?n.classList.add("text-active"):n.classList.remove("text-active")}(a,c)}(e,e.dataset.class,JSON.parse(e.dataset.upload),t,c)))})),n.appendChild(t)}))}(J,e.dataset.content):await async function(e,t,n){e.style.flexDirection="column";const a=JSON.parse(t)[0],c=a.cms_settings[0].setting,d=a.cms_settings[0].setting_class,o=M(d,c,a.cms_settings[0].upload);e.appendChild(o);const i=await H[n](d);e.appendChild(i)}(J,e.dataset.content,t.target.dataset.page)),F.forEach((t=>{t!==e&&t.classList.remove("menu__item_bold")}))}))}))})();