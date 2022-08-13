"use strict";

import { AlbumDetails } from "../../Models/AlbumDetails.mjs";

const style = `
    <style>
        :host {
            display: none;
            z-index: 1;
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            grid-template-rows: 1fr;
            grid-template-columns: 1fr 1fr;
            background-color: white;
        }
        #button-back {
            position: absolute;
            width: 5%;
            height: 5%;
            border: none;
            background-color: transparent;
            background-repeat: no-repeat;
            cursor: pointer;
        }
        #section-info {
            padding: 3rem;
        }
        #section-info p {
            font-size: .5rem;
        }
        #album-streams {
            padding: 0;
        }
        #album-streams a {
            text-decoration: none;
            color: black;
            background-color: bisque;
            border: 1px solid;
            border-radius: 5px;
            border-width: medium;
            padding: 0.2rem;
        }
    </style>
`;

export class SingleItemView extends HTMLElement {
    #item;
    #shadowRoot;
    #title;
    #artist;
    #releasedYear;
    #recommendation;
    #streams;
    #genre;
    #recommendedTracks;

    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.innerHTML = style;
        this.#shadowRoot = shadowRoot;
        this.hide = this.hide.bind(this);
        this.#addBackButton();
        this.#addInfoSection();
    }

    #addBackButton() {
        const backButton = document.createElement("button");
        backButton.style.backgroundImage = "url(./src/images/icons/reshot-icon-angle-back-8E4DS2MACR.svg)";
        backButton.setAttribute("id", "button-back");
        backButton.addEventListener("click", () => {
            this.#removeChildren(this.#recommendedTracks);
            this.#removeChildren(this.#streams);
            this.#enableItemListScroll();
            this.hide();
        });
        this.#shadowRoot.appendChild(backButton);
    }

    #enableItemListScroll() {
        const mainContainer = document.querySelector("main-container");
        const itemList = mainContainer.shadowRoot.querySelector("item-list");
        itemList.style.overflow = "scroll";
    }

    #removeChildren(node) {
        if (node) {
            while (node.lastChild) {
                node.removeChild(node.lastChild);
            }
        }
    }

    hide() {
        this.style.display = "none";
    }

    display() {
        this.style.display = "grid";
    }

    #addInfoSection() {
        const section = document.createElement("section");
        section.setAttribute("id", "section-info");

        const title = document.createElement("p");
        title.setAttribute("id", "album-title");
        this.#title = title;
        const artist = document.createElement("p");
        artist.setAttribute("id", "album-artist");
        this.#artist = artist;
        const genre = document.createElement("p");
        genre.setAttribute("id", "album-genre");
        this.#genre = genre;
        const recommendation = document.createElement("p");
        recommendation.setAttribute("id", "album-recommendation");
        this.#recommendation = recommendation;
        const releasedYear = document.createElement("p");
        releasedYear.setAttribute("id", "album-releaseYear");
        this.#releasedYear = releasedYear;
        const streams = document.createElement("ul");
        streams.setAttribute("id", "album-streams");
        this.#streams = streams;
        const recommendedTracks = document.createElement("section");
        recommendedTracks.setAttribute("id", "album-recommendedTracks");
        this.#recommendedTracks = recommendedTracks;

        section.appendChild(title);
        section.appendChild(artist);
        section.appendChild(genre);
        section.appendChild(recommendation);
        section.appendChild(releasedYear);
        section.appendChild(streams);
        section.appendChild(recommendedTracks);

        this.#shadowRoot.appendChild(section);
    }

    showItem(item) {
        this.#addItemInfo(item.getItemObject());
        this.#addItemImg(item.getAlbumArt());
        this.display();
    }


    #addItemInfo(itemObject) {
        const infoSection = this.#shadowRoot.querySelector("#section-info");
        this.#removeChildren(this.#streams);
        this.#removeChildren(this.#recommendedTracks);
        if (infoSection) {
            const albumDetails = new AlbumDetails(itemObject);
            
            this.#title.textContent = albumDetails.getTitleText();
            
            this.#artist.textContent = albumDetails.getArtistText();
            
            this.#genre.textContent = albumDetails.getGenreText();
            
            this.#recommendation.textContent = albumDetails.getRecommendationText();
            
            this.#releasedYear.textContent = albumDetails.getReleasedYearText();
            
            for (const [service, url] of albumDetails.getStreamList()) {
                const stream = document.createElement("a");
                stream.textContent = service;
                stream.setAttribute("href", url);
                this.#streams.appendChild(stream);
            }
            
            for (const [head, tail] of albumDetails.getRecommendedTracks()) {
                const trackBox = document.createElement("div");
                const trackHead = document.createElement("span");
                const trackTail = document.createElement("span");
                trackHead.textContent = head;
                trackTail.textContent = tail;
                trackBox.appendChild(trackHead);
                trackBox.appendChild(trackTail);
                this.#recommendedTracks.appendChild(trackBox);
            }
            

        }
    }

    #addItemImg(itemImg) {
        const imgContainer = this.#shadowRoot.querySelector("#img-container");
        if (imgContainer) {
            imgContainer.addImg(itemImg);
        }
    }

    addSingleImg(imgView) {
        if (imgView) {
            imgView.setAttribute("id", "img-container");
            this.#shadowRoot.appendChild(imgView);
        }
    }

    addImgCarousel(imgCarousel) {
        if (imgCarousel) {
            imgCarousel.setAttribute("id", "img-container");
            this.#shadowRoot.appendChild(imgCarousel);
        }
    }
}

customElements.define("single-item", SingleItemView);