const body = document.querySelector("body");
const buttons = document.querySelectorAll(".menu_button");
const open = document.querySelector(".open_button");

const dates = document.querySelectorAll("#date");
const year = new Date().getFullYear();
const backdrop = document.querySelector(".dialog_modal::backdrop");

function copyright() {
	dates.forEach((date) => {
		date.textContent = year;
	});
}

function menuToggle() {
	if (open) {
		buttons.forEach((button) => {
			button.addEventListener("click", () => {
				const isActive = body.classList.toggle("menu_active");
				if (isActive) {
					open.setAttribute("aria-expanded", "true");
				} else {
					open.setAttribute("aria-expanded", "false");
				}
			});
		});
	}
}

function escapeToggle() {
	if (open) {
		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape" && body.classList.contains("menu_active")) {
				body.classList.remove("menu_active");
				open.setAttribute("aria-expanded", "false");
			}
		});
	}
}

function createDialog() {
	const videos = document.querySelectorAll(".article");
	videos.forEach((video) => {
		const button = video.querySelector(".play_video");
		const title = video.querySelector(".video_title");
		button.addEventListener("click", (e) => {
			// create dialog
			const grid = document.querySelector(".grid");
			const dialog = document.createElement("dialog");
			dialog.classList.add("dialog_modal");
			grid.insertAdjacentElement("afterend", dialog);

			// create close button
			const closeButton = document.createElement("button");
			closeButton.classList.add("close_dialog");
			closeButton.setAttribute("aria-label", "Close Video");
			closeButton.innerHTML = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="none" stroke="" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368"/></svg>';
			dialog.insertAdjacentElement("afterbegin", closeButton);

			// create iframe
			const id = e.currentTarget.dataset.attribute;
			const type = e.currentTarget.dataset.type;
			console.log(id, type, title.textContent);
			const iframe = document.createElement("iframe");
			iframe.setAttribute("src", `https://www.youtube.com/embed/${id}`);
			iframe.setAttribute("title", title.textContent);
			iframe.setAttribute("frameborder", "0");
			iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
			iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
			iframe.setAttribute("allowfullscreen", "");
			dialog.insertAdjacentElement("beforeend", iframe);

			// show modal dialog
			dialog.showModal();
			body.classList.add("dialog");

			// remove modal dialog
			closeButton.addEventListener("click", () => {
				dialog.remove();
				body.classList.remove("dialog");
			});
		});
	});
}

document.addEventListener("DOMContentLoaded", () => {
	menuToggle();
	escapeToggle();
	copyright();
	createDialog();
});
