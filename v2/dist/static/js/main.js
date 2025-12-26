'use strict';

function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var header = document.querySelector('[data-header]');
if (header) {
  var lastScroll = 0;
  var screenHeight = 200;
  var triggerPoint = 0; // где начался апскролл
  var downStartPoint = 0; // где начался даунскролл после показа
  var showOffset = 100; // через сколько пикселей вверх показать
  var hideDelay = 100; // через сколько пикселей вниз скрыть после показа

  window.addEventListener('scroll', function () {
    var currentScroll = window.scrollY;

    // 1. добавляем header--is-fixed-hidden когда один экран проскролен
    if (currentScroll > screenHeight) {
      header.classList.add('header--is-fixed-hidden');
    } else {
      // 2. убираем классы при возврате к верху
      header.classList.remove('header--is-fixed-hidden');
      header.classList.remove('header--is-fixed-visible');
    }

    // скролл вверх
    if (currentScroll < lastScroll && currentScroll > screenHeight) {
      if (triggerPoint === 0) triggerPoint = lastScroll; // начало апскролла

      if (triggerPoint - currentScroll > showOffset) {
        header.classList.add('header--is-fixed-visible');
        header.classList.remove('header--is-fixed-hidden');
        downStartPoint = 0; // сбрасываем точку даунскролла
      }
    }

    // скролл вниз
    if (currentScroll > lastScroll && currentScroll > screenHeight) {
      if (header.classList.contains('header--is-fixed-visible')) {
        if (downStartPoint === 0) downStartPoint = lastScroll; // начало даунскролла
        if (currentScroll - downStartPoint > hideDelay) {
          header.classList.remove('header--is-fixed-visible');
          header.classList.add('header--is-fixed-hidden');
          triggerPoint = 0;
        }
      } else {
        triggerPoint = 0;
      }
    }
    lastScroll = currentScroll;
  });
}
var initTabs = function initTabs(btnAttr, contentAttr, btnActiveClass, contentActiveClass) {
  var tabs = document.querySelectorAll("[".concat(btnAttr, "]"));
  if (!tabs.length) return;
  var contents = document.querySelectorAll("[".concat(contentAttr, "]"));
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var value = tab.getAttribute(btnAttr);
      tabs.forEach(function (t) {
        return t.classList.remove(btnActiveClass);
      });
      contents.forEach(function (c) {
        return c.classList.remove(contentActiveClass);
      });
      tab.classList.add(btnActiveClass);
      var target = document.querySelector("[".concat(contentAttr, "=\"").concat(value, "\"]"));
      if (target) target.classList.add(contentActiveClass);
    });
  });
};
initTabs('tab', 'tab-content', 'tabs__btn--active', 'tabs__content--active');
initTabs('tab-2', 'tab-2-content', 'tabs-2__btn--active', 'tabs-2__content--active');
var selects = document.querySelectorAll('[data-select]');
if (selects.length) {
  selects.forEach(function (item) {
    var select = item.querySelector('[data-select-btn]');
    var selectText = item.querySelector('[data-select-text]');
    var list = item.querySelector('[data-select-list]');
    var items = _toConsumableArray(item.querySelectorAll('[data-select-value]'));
    var input = item.querySelector('[data-select-input]');
    var hasMultiple = item.hasAttribute('data-select-multiple');
    var hasSearch = item.hasAttribute('data-select-sort');
    var search = item.querySelector('[data-select-search]');
    var selectedValueFirst = item.hasAttribute('data-selected-value-first');
    var lastHovered = null;

    // возвращает список к исходной структуре
    var restoreList = function restoreList(items) {
      list.innerHTML = '';
      items.forEach(function (i) {
        i.classList.remove('d-none');
        list.appendChild(i);
      });
      items[0].classList.add('select__item--active');
    };
    var open = function open() {
      closeAll();
      restoreList(items);
      select.classList.add('select--active');
      list.classList.add('select__list--visible');
      if (hasSearch) {
        select.classList.add('d-none');
        search.classList.remove('d-none');
        input.focus();
        input.value = '';
      }
    };
    var close = function close() {
      select.classList.remove('select--active');
      list.classList.remove('select__list--visible');
      if (hasSearch) {
        select.classList.remove('d-none');
        search.classList.add('d-none');
      }
    };
    var closeAll = function closeAll() {
      document.querySelectorAll('[data-select].select--active').forEach(function (other) {
        if (other === item) return;
        var otherBtn = other.querySelector('[data-select-btn]');
        var otherList = other.querySelector('[data-select-list]');
        var otherSearch = other.querySelector('[data-select-search]');
        otherBtn.classList.remove('select--active');
        otherList.classList.remove('select__list--visible');
        if (other.hasAttribute('data-select-sort')) {
          otherBtn.classList.remove('d-none');
          if (otherSearch) otherSearch.classList.add('d-none');
        }
      });
    };

    // сброс одиночного выбора
    var clearSingleSelect = function clearSingleSelect(items) {
      items.forEach(function (i) {
        return i.classList.remove('select__item--selected');
      });
    };

    // установка выбранного элемента
    var applySingleSelect = function applySingleSelect(item, selectText, input) {
      item.classList.add('select__item--selected');
      selectText.textContent = item.textContent.trim();
      selectText.classList.add('select__text--active');
      input.value = item.dataset.selectValue;
      input.setAttribute('value', input.value);
    };

    // установка выбранных элементов
    var applyMultiSelect = function applyMultiSelect(items, selectText, input) {
      var active = items.filter(function (i) {
        return i.classList.contains('select__item--selected');
      });
      var texts = active.map(function (i) {
        return i.textContent.trim();
      });
      var values = active.map(function (i) {
        return i.dataset.selectValue;
      });
      selectText.textContent = texts.join(', ') || 'Не выбрано';
      selectText.classList.add('select__text--active');
      input.value = values.join(',');
      input.setAttribute('value', input.value);
    };
    var applyPreset = function applyPreset() {
      var preset = items.filter(function (i) {
        return i.classList.contains('select__item--selected');
      });
      if (!preset.length) return;
      if (!hasMultiple) {
        clearSingleSelect(items);
        applySingleSelect(preset[0], selectText, input);
      } else {
        applyMultiSelect(preset, selectText, input);
      }
    };
    var selectSingle = function selectSingle(item) {
      clearSingleSelect(items);
      applySingleSelect(item, selectText, input);
      close();
    };
    var resetButtons = _toConsumableArray(document.querySelectorAll('[data-reset-select]')).filter(function (btn) {
      return btn.dataset.resetSelect.split(',').map(function (x) {
        return x.trim();
      }).includes(item.dataset.selectId);
    });

    // выбор элемента списка + hover-логика
    var bindItems = function bindItems() {
      items.forEach(function (item) {
        item.addEventListener('click', function (e) {
          e.preventDefault();
          resetButtons.forEach(function (btn) {
            return btn.removeAttribute('disabled');
          });
          if (!hasMultiple) {
            selectSingle(item);
          } else {
            item.classList.toggle('select__item--selected');
            applyMultiSelect(items, selectText, input);
          }
        });
        item.addEventListener('mouseover', function () {
          if (lastHovered && lastHovered !== item) {
            lastHovered.classList.remove('select__item--active');
          }
          item.classList.add('select__item--active');
          lastHovered = item;
        });
      });
    };

    // поиск по опциям
    if (hasSearch) {
      input.addEventListener('input', function () {
        var q = input.value.trim().toLowerCase();
        var matched = items.filter(function (item) {
          return item.textContent.trim().toLowerCase().includes(q);
        });
        if (matched.length === 0) {
          list.innerHTML = "<span class=\"select__empty\">\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E</span>";
          return;
        }
        restoreList(matched);
      });
    }
    select.addEventListener('click', function (e) {
      e.preventDefault();
      select.classList.contains('select--active') ? close() : open();
    });

    // закрытие при клике вне селекта
    document.addEventListener('click', function (e) {
      if (!select.contains(e.target)) close();
    });

    // закрытие при Esc
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    // закрытие при Tab (уход фокуса с последнего элемента)
    select.addEventListener('keydown', function (e) {
      if (e.code === 'Tab' && document.activeElement === items[items.length - 1]) {
        close();
      }
    });

    // Получить и обновить блоки, зависящие от спец селекторов
    var updateLocalFields = function updateLocalFields(value) {
      var getLocalFields = function getLocalFields() {
        var el = item;
        while (el && el !== document.body) {
          var found = el.querySelectorAll('[data-specific-field]');
          if (found.length) return Array.from(found);
          el = el.parentElement;
        }
        return [];
      };
      var local = getLocalFields();
      local.forEach(function (f) {
        f.classList.toggle('d-none', f.dataset.specificField !== value);
      });
    };
    var toggleSpecificBlock = function toggleSpecificBlock() {
      var update = function update() {
        var selected = items.filter(function (i) {
          return i.classList.contains('select__item--selected');
        });
        var values = selected.length ? selected.map(function (s) {
          return s.dataset.selectValue;
        }) : [items[0].dataset.selectValue];
        updateLocalFields(values[0]);
      };
      update();
      items.forEach(function (opt) {
        return opt.addEventListener('click', function () {
          return setTimeout(update, 0);
        });
      });
    };
    resetButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        updateLocalFields(items[0].dataset.selectValue);
        selectText.textContent = selectText.dataset.selectText;
        selectText.classList.remove('select__text--active');
        input.value = '';
        selectedValueFirst ? selectSingle(items[0]) : null;
        btn.setAttribute('disabled', true);
      });
    });
    applyPreset();
    bindItems();
    toggleSpecificBlock();
  });
}
var modalLinks = document.querySelectorAll('[data-modal]');
if (modalLinks.length) {
  var body = document.querySelector('body');
  var _header = document.querySelector('header');
  var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  var modalClose = function modalClose(currentModal) {
    if (!currentModal) return;
    currentModal.classList.remove('modal--open');

    // если нет открытых модалок — возвращаем прокрутку
    if (!document.querySelector('.modal--open')) {
      body.classList.remove('fixed');
      body.style.paddingRight = '';
      if (_header) {
        _header.style.paddingRight = '';
      }
    }
  };
  var modalOpen = function modalOpen(currentModal) {
    var activeModal = document.querySelector('.modal--open');
    if (activeModal && activeModal !== currentModal) {
      modalClose(activeModal);
    }
    if (!currentModal) return;
    currentModal.classList.add('modal--open');
    body.classList.add('fixed');
    body.style.paddingRight = "".concat(scrollbarWidth, "px");
    if (_header) {
      _header.style.paddingRight = "".concat(scrollbarWidth, "px");
    }

    // закрытие при клике вне модального контента
    currentModal.addEventListener('click', function (e) {
      if (!e.target.closest('.modal__content')) {
        modalClose(currentModal);
      }
    });
  };
  document.querySelectorAll('[data-btn]').forEach(function (closeBtn) {
    closeBtn.addEventListener('click', function () {
      modalClose(closeBtn.closest('.modal'));
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var activeModal = document.querySelector('.modal--open');
      modalClose(activeModal);
    }
  });
  modalLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var modalId = link.dataset.modal;
      var targetModal = document.getElementById(modalId);
      modalOpen(targetModal);
    });
  });
}
var fileInputs = document.querySelectorAll('[data-input="file"]');
var dropZone = document.querySelector('[data-dropzone]');
var fileLabelErrorText = document.querySelector('[data-input-error]');
var fileLabelPlaceholder = document.querySelector('[data-input-placeholder]');
var buttonsReset = document.querySelectorAll('[type="reset"]');
if (fileInputs.length) {
  var fileInput = document.querySelector('[data-input="file"]');
  var fileLabel = document.querySelector('[data-input="label"]');
  var updateFileLabel = function updateFileLabel(files) {
    if (!files || files.length === 0) {
      fileLabel.textContent = fileLabelPlaceholder.dataset.inputPlaceholder;
      return;
    }
    var invalidFiles = Array.from(files).filter(function (file) {
      return !file.type.startsWith('image/');
    });
    if (invalidFiles.length > 0) {
      fileLabel.textContent = fileLabelErrorText.dataset.inputError;
      fileInput.value = '';
      return;
    }
    if (files.length === 1) {
      fileLabel.textContent = "".concat(files.length, " \u0444\u0430\u0439\u043B \u0432\u044B\u0431\u0440\u0430\u043D");
    } else if (files.length <= 4) {
      fileLabel.textContent = "".concat(files.length, " \u0444\u0430\u0439\u043B\u0430 \u0432\u044B\u0431\u0440\u0430\u043D\u043E");
    } else {
      fileLabel.textContent = "".concat(files.length, " \u0444\u0430\u0439\u043B\u043E\u0432 \u0432\u044B\u0431\u0440\u0430\u043D\u043E");
    }
    dropZone.classList.remove('form-file--bg');
  };
  fileInput.addEventListener('change', function () {
    return updateFileLabel(fileInput.files);
  });
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (evt) {
    return dropZone.addEventListener(evt, function (e) {
      return e.preventDefault();
    });
  });

  // Обработка drop
  dropZone.addEventListener('drop', function (e) {
    var files = e.dataTransfer.files;
    if (files.length > 0) {
      fileInput.files = files;
      updateFileLabel(files);
    }
  });
  Array.from(buttonsReset).filter(function (btnReset) {
    return btnReset.addEventListener('click', function () {
      fileLabel.textContent = fileLabelPlaceholder.dataset.inputPlaceholder;
      fileInput.value = '';
      dropZone.classList.add('form-file--bg');
    });
  });
}
var fileInputsWithImage = document.querySelectorAll('[data-input="file-download"]');
if (fileInputsWithImage.length) {
  fileInputsWithImage.forEach(function (fileInput, index) {
    var wrappers = document.querySelectorAll('[data-input="file-download-wrapper"]');
    var labels = document.querySelectorAll('[data-input="file-download-label"]');
    var blocks = document.querySelectorAll('[data-input="file-download-block"]');
    var images = document.querySelectorAll('[data-input="file-download-img"]');
    var texts = document.querySelectorAll('[data-input="file-download-text"]');
    var btnsDelete = document.querySelectorAll('[data-input="file-download-delete"]');
    var updateFileLabelWithImage = function updateFileLabelWithImage(files) {
      if (!files || files.length === 0) {
        labels[index].textContent = fileLabelPlaceholder.dataset.inputPlaceholder;
        return;
      }
      var invalidFiles = Array.from(files).filter(function (file) {
        return !file.type.startsWith('image/');
      });
      if (invalidFiles.length > 0) {
        labels[index].textContent = fileLabelErrorText.dataset.inputError;
        fileInput.value = '';
        return;
      }

      // URL для предпросмотра
      var imageURL = URL.createObjectURL(files[0]);
      blocks[index].classList.remove('d-none');
      images[index].src = imageURL;
      texts[index].textContent = files[0].name;
      wrappers[index].classList.add('d-none');
      images[index].onload = function () {
        return URL.revokeObjectURL(imageURL);
      };
    };
    var clearFileLabelWithImage = function clearFileLabelWithImage() {
      fileInput.value = '';
      labels[index].innerHTML = "<span class=\"form-file-2__action\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0444\u043E\u0442\u043E \u0430\u0432\u0442\u043E\u043C\u043E\u0431\u0438\u043B\u044F</span>";
      blocks[index].classList.add('d-none');
      images[index].src = '';
      texts[index].textContent = '';
      wrappers[index].classList.remove('d-none');
    };
    fileInput.addEventListener('change', function () {
      return updateFileLabelWithImage(fileInput.files);
    });
    btnsDelete[index].addEventListener('click', function () {
      clearFileLabelWithImage();
    });
    Array.from(buttonsReset).filter(function (btnReset) {
      return btnReset.addEventListener('click', function () {
        clearFileLabelWithImage();
      });
    });
  });
}
var notificationLinks = document.querySelectorAll('[data-notification]');
if (notificationLinks.length) {
  var notificationClose = function notificationClose(currentNotification) {
    if (!currentNotification) return;
    currentNotification.classList.remove('notification--open');
  };
  var notificationOpen = function notificationOpen(currentNotification) {
    var activeNotification = document.querySelector('.notification--open');
    if (activeNotification && activeNotification !== currentNotification) {
      notificationClose(activeNotification);
    }
    if (!currentNotification) return;
    currentNotification.classList.add('notification--open');
    setTimeout(function () {
      notificationClose(currentNotification);
    }, 5000);
  };
  document.querySelectorAll('[data-btn]').forEach(function (closeBtn) {
    closeBtn.addEventListener('click', function () {
      notificationClose(closeBtn.closest('.notification'));
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var activeNotification = document.querySelector('.notification--open');
      notificationClose(activeNotification);
    }
  });
  notificationLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var notificationId = link.dataset.notification;
      var targetNotification = document.getElementById(notificationId);
      notificationOpen(targetNotification);
    });
  });
}
var accordions = document.querySelectorAll('[data-accordion]');
if (accordions.length) {
  accordions.forEach(function (accordion) {
    var accordionButtons = accordion.querySelectorAll('[data-accordion-btn]');
    var accordionItems = accordion.querySelectorAll('[data-accordion-item]');
    accordionButtons.forEach(function (item, index) {
      item.addEventListener('click', function () {
        accordionItems[index].classList.toggle('accordion__item-content--active');
      });
    });
  });
}
var formNumberArray = document.querySelectorAll('[data-form-number]');
if (formNumberArray.length) {
  var setValue = function setValue(input, value) {
    input.value = value;
    input.setAttribute('value', value);
  };
  var updateTwins = function updateTwins(input) {
    var formNumber = input.closest('[data-form-number]');
    if (!formNumber) return;
    var id = formNumber.dataset.formNumber;
    if (!id) return;
    var value = +input.value || 0;
    document.querySelectorAll("[data-form-number=\"".concat(id, "\"]")).forEach(function (block) {
      var twin = block.querySelector('input');
      if (!twin || twin === input) return;
      setValue(twin, value);
    });
  };
  document.addEventListener('click', function (e) {
    var increment = e.target.closest('[data-increment]');
    var decrement = e.target.closest('[data-decrement]');
    if (!increment && !decrement) return;
    var formNumber = e.target.closest('[data-form-number]');
    if (!formNumber) return;
    var input = formNumber.querySelector('input');
    if (!input) return;
    var value = +input.value || 0;
    if (increment) value++;
    if (decrement && value > 0) value--;
    setValue(input, value);
    updateTwins(input);
  });
  document.addEventListener('input', function (e) {
    var input = e.target.closest('[data-form-number] input');
    if (!input) return;
    var value = +input.value || 0;
    setValue(input, value);
    updateTwins(input);
  });
}
var tables = document.querySelectorAll('[data-table]');
if (tables.length) {
  tables.forEach(function (table) {
    var container = table.querySelector('[data-table-scrollbar]');
    var inner = table.querySelector('[data-table-inner]');
    var floatingTable = null;
    var buildFloating = function buildFloating() {
      if (floatingTable) return;
      floatingTable = document.createElement('table');
      floatingTable.className = 'table__floating-table';
      table.appendChild(floatingTable);
      var rows = inner.querySelectorAll('tr');
      rows.forEach(function (row) {
        var src = row.querySelector('td:last-child, th:last-child');
        if (!src) return;
        var tr = document.createElement('tr');
        tr.className = 'table__floating-table-row';
        var td = document.createElement('td');
        td.className = 'table__floating-table-col';
        td.innerHTML = src.innerHTML;
        tr.appendChild(td);
        floatingTable.appendChild(tr);
      });
      syncHeights();
    };
    var removeFloating = function removeFloating() {
      if (!floatingTable) return;
      floatingTable.remove();
      floatingTable = null;
    };
    var syncHeights = function syncHeights() {
      if (!floatingTable) return;
      var srcRows = inner.querySelectorAll('tr');
      var flRows = floatingTable.querySelectorAll('.table__floating-table-row');
      flRows.forEach(function (flRow, i) {
        var h = srcRows[i].offsetHeight;
        flRow.style.height = h + 'px';
      });
    };
    var updateState = function updateState() {
      var need = inner.scrollWidth > container.clientWidth;
      if (need) {
        buildFloating();
        syncHeights();
      } else {
        removeFloating();
      }
    };
    updateState();
    window.addEventListener('resize', function () {
      updateState();
      syncHeights();
    });
  });
}
var checksMain = document.querySelectorAll('[data-checkbox-main]');
if (checksMain.length) {
  checksMain.forEach(function (checkMain) {
    var checks = document.querySelectorAll('[data-checkbox]');
    var checkProducts = document.querySelectorAll('[data-checked-product]');
    var checkNotProducts = document.querySelector('[data-not-checked-product]');
    var orders = document.querySelectorAll('[data-order]');
    var bar = document.querySelector('[data-action-bar]');
    var calculateAmount = function calculateAmount() {
      // Распарсить сумму с пробелами и запятой
      var parseAmount = function parseAmount(str) {
        return Number(str.replace(/\s/g, '').replace(',', '.').trim());
      };
      var sum = 0;
      var count = 0;
      orders.forEach(function (order) {
        var check = order.querySelector('[data-checkbox]');
        if (!check.checked) return;
        var amount = parseAmount(order.querySelector('[data-order-amount]').textContent);
        if (!isNaN(amount)) {
          sum += amount;
          count++;
        }
      });
      document.querySelector('[data-order-total]').textContent = String(sum.toFixed(2));
      document.querySelector('[data-order-count]').textContent = String(count);
      if (count > 0) {
        checkProducts.forEach(function (block) {
          return block.classList.remove('d-none');
        });
        checkNotProducts.classList.add('d-none');
      } else {
        checkProducts.forEach(function (block) {
          return block.classList.add('d-none');
        });
        checkNotProducts.classList.remove('d-none');
      }
    };
    var updateBar = function updateBar() {
      var anyChecked = _toConsumableArray(checks).some(function (check) {
        return check.checked;
      });
      bar.classList.toggle('action-bar--is-visible', anyChecked);
    };
    checkMain.addEventListener('change', function () {
      checks.forEach(function (check) {
        return check.checked = checkMain.checked;
      });
      updateBar();
      calculateAmount();
    });
    checks.forEach(function (check) {
      check.addEventListener('change', function () {
        checkMain.checked = _toConsumableArray(checks).every(function (c) {
          return c.checked;
        });
        updateBar();
        calculateAmount();
      });
    });
  });
}
var wrap = document.querySelector('[data-filter-bar-shadow]');
var scroller = document.querySelector('[data-filter-bar-scrollbar]');
if (wrap && scroller) {
  var update = function update() {
    var max = scroller.scrollWidth - scroller.clientWidth;
    var edge = 5;
    var atStart = scroller.scrollLeft <= edge;
    var atEnd = scroller.scrollLeft >= max - edge;
    if (!atStart) {
      wrap.classList.add('filter-bar__shadow-wrap--left-shadow');
    } else {
      wrap.classList.remove('filter-bar__shadow-wrap--left-shadow');
    }
    if (!atEnd) {
      wrap.classList.add('filter-bar__shadow-wrap--right-shadow');
    } else {
      wrap.classList.remove('filter-bar__shadow-wrap--right-shadow');
    }
  };
  update();
  scroller.addEventListener('scroll', update);
  window.addEventListener('resize', update);
}
var recharge = document.querySelector('[data-recharge]');
var deduce = document.querySelector('[data-deduce]');
var removeDisabledFromBlock = function removeDisabledFromBlock(input, btnReset, btnSubmit) {
  input.focus();
  btnReset.classList.remove('btn-primary--disabled');
  btnSubmit.classList.remove('btn--disabled');
};
var addDisabledToBlock = function addDisabledToBlock(input, btnReset, btnSubmit) {
  input.value = '';
  btnReset.classList.add('btn-primary--disabled');
  btnSubmit.classList.add('btn--disabled');
};
if (recharge) {
  var items = _toConsumableArray(recharge.querySelectorAll('[data-select-value]'));
  var inputWrapper = recharge.querySelector('[data-input-tail]');
  var input = recharge.querySelector('[data-input-tail] input');
  var btnReset = recharge.querySelector('[data-recharge-reset]');
  var btnSubmit = recharge.querySelector('[data-recharge-submit]');
  items.forEach(function (i) {
    i.addEventListener('click', function () {
      if (i.classList.contains('select__item--selected')) {
        inputWrapper.classList.remove('form-input-tail--disabled');
        removeDisabledFromBlock(input, btnReset, btnSubmit);
      }
    });
  });
  btnReset.addEventListener('click', function () {
    items.forEach(function (i) {
      if (i.classList.contains('select__item--selected')) {
        i.classList.remove('select__item--selected');
        inputWrapper.classList.add('form-input-tail--disabled');
        addDisabledToBlock(input, btnReset, btnSubmit);
      }
    });
  });
}
if (deduce) {
  var _inputWrapper = deduce.querySelector('[data-input-tail]');
  var _input = deduce.querySelector('[data-input-tail] input');
  var _btnReset = deduce.querySelector('[data-deduce-reset]');
  var _btnSubmit = deduce.querySelector('[data-deduce-submit]');
  _input.addEventListener('input', function () {
    removeDisabledFromBlock(_input, _btnReset, _btnSubmit);
  });
  _btnReset.addEventListener('click', function () {
    addDisabledToBlock(_input, _btnReset, _btnSubmit);
  });
}
var date = document.querySelector('#order-date');
if (date) {
  var resetButtons = _toConsumableArray(document.querySelectorAll('[type="reset"]'));
  flatpickr(date, {
    mode: "range",
    minDate: "today",
    dateFormat: "Y-m-d",
    locale: "ru",
    onReady: function onReady(selectedDates, dateStr, instance) {
      resetButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          instance.clear();
        });
      });
    }
  });
}
var listCategories = document.querySelectorAll('[data-categories-list]');
if (listCategories.length) {
  listCategories.forEach(function (list) {
    var items = list.querySelectorAll('[data-categories-item]');
    var btns = list.querySelectorAll('[data-categories-btn]');
    var sublist = list.querySelectorAll('[data-categories-sublist]');
    var iconsPlus = list.querySelectorAll('[data-categories-ico-plus]');
    var iconsMinus = list.querySelectorAll('[data-categories-ico-minus]');
    btns.forEach(function (btn, index) {
      btn.addEventListener('click', function () {
        items[index].classList.toggle('details__item--open');
        sublist[index].classList.toggle('d-none');
        iconsMinus[index].classList.toggle('d-none');
        iconsPlus[index].classList.toggle('d-none');
      });
    });
  });
}
var tooltips = document.querySelectorAll('[data-tippy-content]');
if (tooltips.length) {
  tooltips.forEach(function (tooltip, index) {
    var width = tooltip.dataset.widthTooltip ? Number(tooltip.dataset.widthTooltip) : 232;
    tippy(tooltip, {
      theme: 'default',
      maxWidth: width
    });
  });
}
var tooltipsLight = document.querySelectorAll('[data-tippy-content-light]');
if (tooltipsLight.length) {
  tooltipsLight.forEach(function (tooltip, index) {
    var width = tooltip.dataset.widthTooltip ? Number(tooltip.dataset.widthTooltip) : 232;
    tippy(tooltip, {
      theme: 'light',
      maxWidth: width
    });
  });
}
var tooltipsWithCode = document.querySelectorAll('[data-tippy-with-code-content]');
if (tooltipsWithCode.length) {
  tooltipsWithCode.forEach(function (tooltipWithCode, index) {
    var width = tooltipWithCode.dataset.widthTooltip ? Number(tooltipWithCode.dataset.widthTooltip) : 232;
    var tooltipContent = "\n    \u0412\u043E\u0437\u0432\u0440\u0430\u0442 \u0432\u043E\u0437\u043C\u043E\u0436\u0435\u043D \u043F\u0440\u0438 \u0441\u043E\u0431\u043B\u044E\u0434\u0435\u043D\u0438\u0438 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0445 \u0443\u0441\u043B\u043E\u0432\u0438\u0439:\n    <ul>\n        <li>\u0423\u043F\u0430\u043A\u043E\u0432\u043A\u0430 \u0438 \u0434\u0435\u0442\u0430\u043B\u044C \u0432 \u0442\u043E\u0432\u0430\u0440\u043D\u043E\u043C \u0432\u0438\u0434\u0435.</li>\n        <li>\u0414\u0435\u0442\u0430\u043B\u044C \u043D\u0435 \u0431\u044B\u043B\u0430 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0430.</li>\n        <li>\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u044B \u0441\u0442\u0438\u043A\u0435\u0440\u044B \u043F\u043E\u0441\u0442\u0430\u0432\u0449\u0438\u043A\u0430.</li>\n        <li>\u0420\u0435\u043A\u043B\u0430\u043C\u0430\u0446\u0438\u044F \u043F\u043E\u0434\u0430\u043D\u0430 \u043D\u0435 \u043F\u043E\u0437\u0434\u043D\u0435\u0435 7 \u0434\u043D\u0435\u0439 \u043F\u043E\u0441\u043B\u0435 \u0441\u0442\u0430\u0442\u0443\u0441\u0430 \"\u041E\u0442\u0433\u0440\u0443\u0436\u0435\u043D\u043E\".</li>\n    </ul>\n    <br>\n    \u041D\u0435 \u043F\u0440\u0438\u043D\u0438\u043C\u0430\u044E\u0442\u0441\u044F \u043A \u0432\u043E\u0437\u0432\u0440\u0430\u0442\u0443: \u043C\u0430\u0441\u043B\u0430, \u0436\u0438\u0434\u043A\u043E\u0441\u0442\u0438 \u0438 \u0434\u0435\u0442\u0430\u043B\u0438 \u044D\u043B\u0435\u043A\u0442\u0440\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u0433\u0440\u0443\u043F\u043F\u044B.";
    tippy(tooltipWithCode, {
      content: tooltipContent,
      allowHTML: true,
      theme: 'default',
      maxWidth: width
    });
  });
}
var tooltipsWithCodeLight = document.querySelectorAll('[data-tippy-with-code-content-light]');
if (tooltipsWithCodeLight.length) {
  tooltipsWithCodeLight.forEach(function (tooltipWithCode, index) {
    var tooltipContentFirst = "\n      <div class=\"tooltip-statistic\">\n        <span class=\"tooltip-statistic__title\">\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u0438 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0438 \u0432\u044B\u0434\u0430\u0447\u0438</span>\n        \u0421\u0440\u043E\u043A\u0438 \u0443\u043A\u0430\u0437\u0430\u043D\u044B \u0432 \u0440\u0430\u0431\u043E\u0447\u0438\u0445 \u0434\u043D\u044F\u0445 \u0434\u043E \u0441\u043A\u043B\u0430\u0434\u0430 \u041C\u0421\u041A. \u0412\u044B\u0431\u0438\u0440\u0430\u044F \u043F\u043E\u0441\u0442\u0430\u0432\u0449\u0438\u043A\u0430, \u0438\u0437\u0443\u0447\u0438\u0442\u0435 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0443 \u043E\u0442\u0433\u0440\u0443\u0437\u043E\u043A.\n        <span class=\"tooltip-statistic__title\">\u0418\u043D\u0434\u0438\u043A\u0430\u0442\u043E\u0440\u044B \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u0430 \u0432\u044B\u0434\u0430\u0447\u0438</span>\n        <p class=\"tooltip-statistic__indicator tooltip-statistic__indicator--1\">90% - 100% \u0432\u044B\u0434\u0430\u043D\u043D\u044B\u0445 \u0437\u0430\u043A\u0430\u0437\u043E\u0432</p>\n        <p class=\"tooltip-statistic__indicator tooltip-statistic__indicator--2\">70% - 89% \u0432\u044B\u0434\u0430\u043D\u043D\u044B\u0445 \u0437\u0430\u043A\u0430\u0437\u043E\u0432</p>\n        <p class=\"tooltip-statistic__indicator tooltip-statistic__indicator--3\">40% - 69% \u0432\u044B\u0434\u0430\u043D\u043D\u044B\u0445 \u0437\u0430\u043A\u0430\u0437\u043E\u0432</p>\n        <p class=\"tooltip-statistic__indicator tooltip-statistic__indicator--4\">20% - 39% \u0432\u044B\u0434\u0430\u043D\u043D\u044B\u0445 \u0437\u0430\u043A\u0430\u0437\u043E\u0432</p>\n        <p class=\"tooltip-statistic__indicator tooltip-statistic__indicator--5\">0% - 19% \u0432\u044B\u0434\u0430\u043D\u043D\u044B\u0445 \u0437\u0430\u043A\u0430\u0437\u043E\u0432</p>\n      </div>";
    var tooltipContentSecond = "\n      <div class=\"tooltip-status\">\n        <p><span class=\"tooltip-status__text\">\u041A\u0430\u0447\u0435\u0441\u0442\u0432\u043E \u0432\u044B\u0434\u0430\u0447\u0438:</span> <span class=\"tooltip-status__procent\">92%</span></p>\n        <p><span class=\"tooltip-status__text\">\u0421\u043A\u043B\u0430\u0434:</span> \u041C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u043F\u0430\u0440\u0442\u0438\u044F 10 \u0448\u0442</p>\n        <p><span class=\"tooltip-status__text\">\u0414\u0430\u0442\u0430 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F \u0446\u0435\u043D\u044B:</span> \u0421\u0435\u0433\u043E\u0434\u043D\u044F</p>\n      </div>";
    var tooltipContent = Number(tooltipWithCode.dataset.tippyWithCodeContentLight) === 1 ? tooltipContentFirst : tooltipContentSecond;
    tippy(tooltipWithCode, {
      content: tooltipContent,
      allowHTML: true,
      theme: 'light',
      maxWidth: 265
    });
  });
}
var createPopperFn = Popper && Popper.createPopper ? Popper.createPopper : null;
if (!createPopperFn) {
  console.error('Popper not found');
}
var dropdownButtons = document.querySelectorAll('[data-dropdown-btn]');
if (dropdownButtons.length) {
  dropdownButtons.forEach(function (btn) {
    var id = btn.dataset.dropdownBtn;
    var dropdown = document.querySelector("[data-dropdown=\"".concat(id, "\"]"));
    var popperInstance = null;
    function initPopper() {
      if (popperInstance) return;
      popperInstance = createPopperFn(btn, dropdown, {
        placement: 'bottom-end'
      });
    }
    function show() {
      initPopper();
      dropdown.classList.add('dropdown--visible');
      popperInstance.update();
    }
    function hide() {
      dropdown.classList.remove('dropdown--visible');
    }
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (!popperInstance) {
        initPopper();
      }
      if (dropdown.classList.contains('dropdown--visible')) {
        hide();
        return;
      }
      show();
    });

    // закроем при клике вне
    document.addEventListener('click', function (e) {
      if (!btn.contains(e.target) && !dropdown.contains(e.target)) hide();
    });

    // обновлять при scroll/resize и при скролле кастомного контейнера
    var container = btn.closest('[data-table-scrollbar]') || window;
    var onScrollResize = function onScrollResize() {
      if (popperInstance) popperInstance.update();
    };
    window.addEventListener('resize', onScrollResize);
    window.addEventListener('scroll', onScrollResize, {
      passive: true
    });
    if (container !== window) container.addEventListener('scroll', onScrollResize, {
      passive: true
    });
  });
}
var inputPassword = document.querySelector('[data-input-password]');
if (inputPassword) {
  var btn = inputPassword.nextElementSibling;
  btn.addEventListener('click', function () {
    inputPassword.type = inputPassword.type === 'password' ? 'text' : 'password';
  });
}