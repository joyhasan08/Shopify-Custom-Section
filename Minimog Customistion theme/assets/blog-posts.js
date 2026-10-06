if (!customElements.get("m-blog-posts")) {
    class MBlogPosts extends HTMLElement {
      constructor() {
        super();
        this.enableSlider = this.dataset.enableSlider === "true";
        this.items = this.dataset.items || "4";
        this.showPagination = this.dataset.showPagination === "true";
        this.showNavigation = this.dataset.showNavigation === "true";
        this.slideContainer = this.querySelector(".m-mixed-layout__wrapper");
        this.slideInner = this.querySelector(".m-mixed-layout__inner");
        this.slider = null;
      }
  
      connectedCallback() {
        if (!this.enableSlider) return;
        this.initSlider();
      }

      initSlider() {
        if (!this.slideContainer || !window.MinimogLibs || !MinimogLibs.Swiper) return;
        const controlsContainer = this.querySelector(".m-slider-controls");
        const prevButton = controlsContainer && controlsContainer.querySelector(".m-slider-controls__button-prev");
        const nextButton = controlsContainer && controlsContainer.querySelector(".m-slider-controls__button-next");
        const wrapper = this.slideInner || this.querySelector(".swiper-wrapper");
        const slideItemsLength = wrapper ? wrapper.childElementCount : 0;
  
        this.slideContainer.classList.add("swiper-container");
        const items = parseInt(this.items, 10) || 4;
        const showNav = this.showNavigation;
  
        this.slider = new MinimogLibs.Swiper(this.slideContainer, {
          slidesPerView: 1,
          loop: slideItemsLength >= items,
          pagination: this.showPagination
            ? {
                el: this.querySelector(".swiper-pagination"),
                clickable: true,
              }
            : false,
          breakpoints: {
            480: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: items >= 3 ? 3 : items,
            },
            1024: {
              slidesPerView: items >= 4 ? 4 : items,
            },
            1280: {
              slidesPerView: items,
            },
          },
          on: {
            init: () => {
              if (controlsContainer && wrapper) {
                const slidesPerView = Math.min(items, slideItemsLength);
                if (slideItemsLength <= slidesPerView) {
                  controlsContainer.classList.add("m:hidden");
                } else if (showNav) {
                  prevButton && prevButton.classList.remove("m:hidden");
                  nextButton && nextButton.classList.remove("m:hidden");
                }
              }
            },
            breakpoint: (swiper, breakpointParams) => {
              if (controlsContainer && breakpointParams && breakpointParams.slidesPerView !== undefined) {
                if (slideItemsLength > breakpointParams.slidesPerView) {
                  controlsContainer.classList.remove("m:hidden");
                  if (showNav) {
                    prevButton && prevButton.classList.remove("m:hidden");
                    nextButton && nextButton.classList.remove("m:hidden");
                  }
                  swiper.allowTouchMove = true;
                } else {
                  controlsContainer.classList.add("m:hidden");
                  swiper.allowTouchMove = false;
                }
              }
            },
          },
        });
  
        if (this.slider && this.showNavigation) {
          prevButton && prevButton.addEventListener("click", () => this.slider.slidePrev());
          nextButton && nextButton.addEventListener("click", () => this.slider.slideNext());
        }
      }
    }
  
    customElements.define("m-blog-posts", MBlogPosts);
  }
  