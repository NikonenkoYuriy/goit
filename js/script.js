/*-----------№-1----------------*/
let builder = new StringBuilder('.');
builder
	.append('^')
	.prepend('^')
	.pad('=');

console.log(builder.value);

/*-----------№-2----------------*/

let jsInput = document.querySelector('.js-input'),
	boxes = document.querySelector('.js-boxes'),
	create = document.querySelector('.js-btn-create'),
	destroy = document.querySelector('.js-btn-destroy'),
	colors = ['red', 'blue', 'orange', 'green', 'aqua', 'aliceblue', 'blueviolet'],
	colorsLength = colors.length,
	startSize = 30,
	sizeToAdd = 10;

let getRandomСolor = () => colors[Math.floor(Math.random() * colorsLength)];

let createBoxes = (amount) => {

	let str = '',
		size = startSize;

	for (let i = 0; i < amount; i++) {
		str += `<div class="element" 
		style="width:${size}px; height:${size}px; background: ${getRandomСolor()}"></div>`;
		size += sizeToAdd;
	}

	boxes.innerHTML = str;

}

let destroyBoxes = () => {
	boxes.innerHTML = '';
	jsInput.value = '';
}

destroy.addEventListener('click', destroyBoxes);
create.addEventListener('click', () => createBoxes(+jsInput.value));

/*------------№-3---------------*/

let apiUrl = 'https://pixabay.com/api/?key=16732586-1b8aa34848c17e1b6beb999db',
	loadPicturesByScroll = true,
	arrPhotos = [];

let getImages = (url) => {

	return fetch(url)
		.then((response) => response.json())
		.then((response) => {
            
			if (response.hits.length === 0) {
				alert('По вашему запросу ничего не найдено!');
				loadPicturesByScroll = false;
				return false;
			}
			
			response.hits.forEach((val) => {
				arrPhotos.push({
					webformatURL: val.webformatURL,
					largeImageURL: val.largeImageURL,
					tags: val.tags
				});
			});
		
		})
		.catch(() => {
			alert('Ошибка, что-то пошло не так! попробуйте позже.');
			return false;
		});
}

let inputQuery = document.querySelector('.js-input-query'),
	listImages = document.querySelector('.js-list-images'),
	boxLoader = document.querySelector('.js-box-loader'),
	closePopup = document.querySelector('.js-close-popup'),
	wrapperModal = document.querySelector('.js-wrapper-modal'),
	imgPopup = document.querySelector('.js-img-popup'),
	subtractHeight = 1100,
	stop = null,
	inputTimeout = 2000,
	indexPage = 1,
	startIndexPage = 1,
	query = '';

let valueFlagTrue = () => loadPicturesByScroll = true;

let handleInput = () => {

	clearTimeout(stop);
	let text = inputQuery.value.trim();

	if (text === '') return false;

	stop = setTimeout(() => {
		arrPhotos = [];
		query = text;
		indexPage = startIndexPage;
		showElement(boxLoader);
		getAndAddImages();
	}, inputTimeout);

}

async function getAndAddImages() {

	await getImages(createURL());
	await addImages();
	await hideElement(boxLoader);
	await valueFlagTrue();

}

let handleScroll = () => {
	let scroll = window.pageYOffset,
		pageHeight = document.querySelector('body').scrollHeight - subtractHeight;

	if (scroll > pageHeight && loadPicturesByScroll) {
		loadPicturesByScroll = false;
		indexPage++
		getAndAddImages();
	}

}

let createURL = () => {
	let par = `${apiUrl}&page=${indexPage}&lang=ru`,
		url = query != '' ? `${par}&q=${query}` : par;
	return url;
}

let showPopup = (e) => {
	
	if (!e.target.classList.contains('js-item-img')) return false;
		e.stopPropagation();
		e.preventDefault();
		let source = e.target.getAttribute('data-source');
		imgPopup.setAttribute('src', source);
		showElement(wrapperModal);
	
}

let addImages = () => {
	let str = '';
	arrPhotos.forEach((val, i) => {
		str += `<li>
					<a href="${val.webformatURL}">
						<img
						src="${val.webformatURL}"
						class="js-item-img"
						data-source="${val.largeImageURL}"
						alt="${val.tags}"/>
					</a>
				</li>`;
	});
	listImages.innerHTML = str;
}

let showElement = (element) => element.classList.remove('hide');

let hideElement = (element) => element.classList.add('hide');

inputQuery.addEventListener('input', handleInput);
closePopup.addEventListener('click', () => hideElement(wrapperModal));
listImages.addEventListener('click', (e) => showPopup(e));
window.addEventListener('scroll', handleScroll);