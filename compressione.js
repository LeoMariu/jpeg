const imageInput = document.getElementById('imageInput');
const qualitySlider = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const originalPreview = document.getElementById('originalPreview');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let image = new Image();

imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    image.onload = function() {
      originalPreview.src = image.src;
      compressAndRender();
    }
    image.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

qualitySlider.addEventListener('input', () => {
  qualityValue.textContent = qualitySlider.value;
  if (image.src) {
    compressAndRender();
  }
});

function compressAndRender() {
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  const quality = parseFloat(qualitySlider.value);
  const compressedDataURL = canvas.toDataURL('image/jpeg', quality);

  const compressedImage = new Image();
  compressedImage.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(compressedImage, 0, 0);
  }
  compressedImage.src = compressedDataURL;
}

