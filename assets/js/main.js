var iUp = (function () {
	var time = 0,
		duration = 150,
		clean = function () {
			time = 0;
		},
		up = function (element) {
			setTimeout(function () {
				element.classList.add("up");
			}, time);
			time += duration;
		},
		down = function (element) {
			element.classList.remove("up");
		},
		toggle = function (element) {
			setTimeout(function () {
				element.classList.toggle("up");
			}, time);
			time += duration;
		};
	return {
		clean: clean,
		up: up,
		down: down,
		toggle: toggle
	};
})();

function getBingImages(imgUrls) {
  /**
   * 获取Bing壁纸
   * 使用 GitHub Action 每天更新 images.json
   * 页面刷新时切换下一张背景图
   */
  const indexName = "bing-image-index";
  let index = sessionStorage.getItem(indexName);

  // 初始化或递增索引
  if (isNaN(index) || index >= imgUrls.length - 1) {
    index = 0;
  } else {
    index++;
  }
   // 获取当前要显示的图片URL
  const imageUrl = imgUrls[index];
  const fullUrl = `https://www.cn.bing.com${imageUrl}`;
  // 设置背景（根据你的 HTML 选择正确的选择器）
  const backgroundElement = document.getElementById('BackgroundArea') || document.getElementById('panel');
  if (backgroundElement) {
    backgroundElement.style.background = `url('${fullUrl}') center center no-repeat #666`;
    backgroundElement.style.backgroundSize = "cover";
  }
  // 保存索引
  sessionStorage.setItem(indexName, index);
}


// 自定义自己的背景图片
function displayMyImage() {
    var panel = document.querySelector('#panel');
    var imageUrl = "https://bing.gyhwd.top/daily.webp"; // 将"YOUR_IMAGE_URL_HERE"替换为你自己的图片URL
    panel.style.background = "url('" + imageUrl + "') center center no-repeat #666";
    panel.style.backgroundSize = "cover";
    //panel.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // 设置背景颜色的透明度为0.5
}

function decryptEmail(encoded) {
	var address = atob(encoded);
	window.location.href = "mailto:" + address;
}

document.addEventListener('DOMContentLoaded', function () {
	// 获取一言数据
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var res = JSON.parse(this.responseText);
			document.getElementById('description').innerHTML = res.hitokoto + "<br/> -「<strong>" + res.from + "</strong>」";
		}
	};
	xhr.open("GET", "https://v1.hitokoto.cn", true);
	xhr.send();

	var iUpElements = document.querySelectorAll(".iUp");
	iUpElements.forEach(function (element) {
		iUp.up(element);
	});

	var avatarElement = document.querySelector(".js-avatar");
	avatarElement.addEventListener('load', function () {
		avatarElement.classList.add("show");
	});
});

var btnMobileMenu = document.querySelector('.btn-mobile-menu__icon');
var navigationWrapper = document.querySelector('.navigation-wrapper');

btnMobileMenu.addEventListener('click', function () {
	if (navigationWrapper.style.display == "block") {
		navigationWrapper.addEventListener('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
			navigationWrapper.classList.toggle('visible');
			navigationWrapper.classList.toggle('animated');
			navigationWrapper.classList.toggle('bounceOutUp');
			navigationWrapper.removeEventListener('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', arguments.callee);
		});
		navigationWrapper.classList.toggle('animated');
		navigationWrapper.classList.toggle('bounceInDown');
		navigationWrapper.classList.toggle('animated');
		navigationWrapper.classList.toggle('bounceOutUp');
	} else {
		navigationWrapper.classList.toggle('visible');
		navigationWrapper.classList.toggle('animated');
		navigationWrapper.classList.toggle('bounceInDown');
	}
	btnMobileMenu.classList.toggle('social');
	btnMobileMenu.classList.toggle('iconfont');
	btnMobileMenu.classList.toggle('icon-list');
	btnMobileMenu.classList.toggle('social');
	btnMobileMenu.classList.toggle('iconfont');
	btnMobileMenu.classList.toggle('icon-angleup');
	btnMobileMenu.classList.toggle('animated');
	btnMobileMenu.classList.toggle('fadeIn');
});
