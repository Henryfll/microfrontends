const container = document.getElementById('mf-container');
const buttons = document.querySelectorAll('[data-mf]');

let currentUnmount = null;

async function loadMF(name) {
  if (currentUnmount) {
    await currentUnmount(container);
    currentUnmount = null;
  }
  container.innerHTML = '';

  let module;
  if (name === 'mfa') {
    module = await import('mfa/Mount');
  } else if (name === 'mfb') {
    module = await import('mfb/Mount');
  } else if (name === 'mfc') {
    module = await import('mfc/Mount');
  }

  if (module) {
    await module.mount(container);
    currentUnmount = module.unmount;
  }
}

buttons.forEach(function (btn) {
  btn.addEventListener('click', function () {
    buttons.forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    loadMF(btn.getAttribute('data-mf')).catch(console.error);
  });
});
