const btn = document.querySelector('button.delete');
if (btn) {
  const message = document.querySelector('div.message');
  btn.addEventListener('click', () => {
    message.style.display = 'none';
  });
}

// 改變上傳圖片名稱
const inputFile = document.querySelector('input[type=file]');
const fileNameSpan = document.querySelector('.file-name');
if (inputFile) {
  inputFile.addEventListener('change', (e) => {
    if (inputFile.files.length > 0) {
      fileNameSpan.innerHTML = inputFile.files[0].name;
    }
  });
}

// 清空上傳圖片
const resetFileButton = document.querySelector('.reset-file');
if (resetFileButton) {
  resetFileButton.addEventListener('click', (e) => {
    inputFile.value = '';
    fileNameSpan.innerHTML = '';
  });
}

// navbar hamberger
const navbarBurgers = document.querySelectorAll('.navbar-burger');
if (navbarBurgers.length > 0) {
  navbarBurgers.forEach((el) => {
    el.addEventListener('click', () => {
      const { target } = el.dataset;
      const targetNode = document.getElementById(target);
      el.classList.toggle('is-active');
      targetNode.classList.toggle('is-active');
    });
  });
}

// notification delete button
const deletes = document.querySelectorAll('.notification .delete') || [];
deletes.forEach((d) => {
  const notification = d.parentNode;
  d.addEventListener('click', () => {
    notification.parentNode.removeChild(notification);
  });
});

// spinner
const newFormBtn = document.querySelector('.new-form button.is-warning');
if (newFormBtn) {
  newFormBtn.addEventListener('click', () => {
    newFormBtn.classList.toggle('is-loading');
  });
}