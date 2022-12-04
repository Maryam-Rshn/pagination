<template>
  <div class="carousel" ref="carousel">
    <div class="slider-wrapper">
      <div class="inner" ref="inner">
        <slot></slot>
      </div>
    </div>
    <div class="carousel-nav">
      <button class="prev" @click="switchToPrev()"><svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 354 511.51"><path fill-rule="nonzero" d="M350.65 117.68 221.03 255.76l129.62 138.08c4.67 4.96 4.43 12.76-.53 17.43l-100.74 96.79c-4.9 4.72-12.71 4.57-17.43-.33L3.35 264.21c-4.49-4.78-4.44-12.19 0-16.9L231.86 3.88c4.66-4.96 12.47-5.2 17.43-.53l100.92 96.99c4.88 4.69 5.06 12.42.44 17.34zM195.13 247.31l129.21-137.64-83.05-79.8L29.25 255.76l212.04 225.89 83.05-79.8-129.21-137.64c-4.43-4.71-4.49-12.12 0-16.9z"/></svg></button>
      <button class="next" @click="switchToNext()"><svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 354 511.51"><path fill-rule="nonzero" d="m3.35 393.83 129.62-138.08L3.35 117.67c-4.67-4.96-4.43-12.76.53-17.43l100.74-96.8c4.9-4.72 12.71-4.56 17.43.34l228.6 243.52c4.49 4.77 4.44 12.19 0 16.9L122.14 507.63c-4.66 4.96-12.47 5.19-17.43.53L3.79 411.17c-4.88-4.69-5.06-12.42-.44-17.34zM158.87 264.2 29.66 401.84l83.05 79.8 212.04-225.89L112.71 29.86l-83.05 79.8L158.87 247.3c4.43 4.71 4.49 12.12 0 16.9z"/></svg></button>
    </div>
    <div class="carousel-dots-wrapper" ref="dotsWrapper">
      <button v-for='index in this.numberOfDots' :key='index' :class="[ 'carousel-dot', `step-${index}` ]" :step="index" @click='switchToStep(index)'></button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Carousel",
    props: {
      optionsObject: Object,
    },
    
    data() {
      return {
        innerWidth: 0,
        slideWidth: 0,
        stepSize: 0,
        currentStep: 0,
        innerPosition: 0,
        numberOfDots: 0,
        slider: '',
        isMouseDown:false,
        startpointCoordinate: null,
        isDistPositive: false,
      }
    },

    methods: {
      calculateInnerPosition( decrease ) {
        if ( decrease ) {
          if ( this.optionsObject.loop && this.innerPosition <= 0 ) {
            this.innerPosition = this.innerWidth - (this.slideWidth * this.optionsObject.itemsPerSlide);  
          } else if ( this.innerPosition > 0 ){
            this.innerPosition -= this.stepSize;
          }
        } else {
          if(this.optionsObject.loop && this.innerPosition >=  this.innerWidth - (this.slideWidth * this.optionsObject.itemsPerSlide) ) {
            this.innerPosition = 0;
          }
          else{
            this.innerPosition += this.stepSize
          }
        }
      },

      switchToNext() {
        this.calculateInnerPosition( false );
        this.$refs.inner.style.cssText = `transform: translateX(-${ this.innerPosition }px)`;
        this.findandActivateCurrentStep()
      },

      switchToPrev() {
        this.calculateInnerPosition( true );
        this.$refs.inner.style.cssText = `transform: translateX(-${ this.innerPosition }px)`;
        this.findandActivateCurrentStep()
      },

      switchToStep( step ) {
        this.innerPosition = this.stepSize * ( step - 1);
        this.$refs.inner.style.cssText = `transform: translateX(-${ this.innerPosition }px)`;
        this.findandActivateCurrentStep()  
      },

      findandActivateCurrentStep() {
        if (this.optionsObject.dots) {
          this.currentStep = this.innerPosition / this.stepSize + 1;
          const dotButtons = document.querySelectorAll( `.carousel-dot` );
          dotButtons.forEach(dot => dot.classList.remove( "active" ))
          document.querySelector( `.carousel-dot[step="${ this.currentStep }"]` ).classList.add( "active" );
        }
      },

      startScroll() {
        this.isMouseDown = false;
        this.slider.classList.remove('active');
        if(!this.isDistPositive) {
          this.switchToNext()
          this.findandActivateCurrentStep()
        } else {
          this.switchToPrev()
          this.findandActivateCurrentStep()
        }
      },
      mouseDown(e) {
        this.isMouseDown = true;
        this.slider.classList.add('active');
        this.startpointCoordinate = e.pageX;
      },
      mouseMove(e) {
        if(this.isMouseDown) {
          e.preventDefault();
          const endPointCoordinate = e.pageX;
          const dist = (endPointCoordinate - this.startpointCoordinate);
          if(dist < 0) {
            this.isDistPositive = false
          } else {
            this.isDistPositive = true
          }
        }
      }
    },

    mounted() {

      // variables
      const innerSelector = this.$refs.inner;
      const slidesSelector = document.querySelectorAll( `.slides` );
      const carouselWidth = innerSelector.clientWidth;

      // calculated variables
      this.slideWidth = ( carouselWidth / this.optionsObject.itemsPerSlide );
      this.stepSize = this.slideWidth * this.optionsObject.itemsPerStep;
      this.numberOfDots = Math.ceil( ( slidesSelector.length - this.optionsObject.itemsPerSlide ) / this.optionsObject.itemsPerStep) + 1;
      

      // add width for slides
      for (let i = 0; i < slidesSelector.length; i++) {
        slidesSelector[i].style.cssText = `min-width:${ this.slideWidth }px !important;`;
      }

      
      // set variables after adding slides width and margins
      this.innerWidth = this.slideWidth * slidesSelector.length;

      // draggable slider
      this.slider = document.querySelector('.inner');
      this.slider.addEventListener('mousedown', this.mouseDown);
      this.slider.addEventListener('mousemove', this.mouseMove);
      this.slider.addEventListener('mouseup', this.startScroll);
    },
  }
</script>

<style  scoped>

  .carousel {
    position: relative;
    width: 70%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 3rem;
    margin: 50px 0;

  }
  .slider-wrapper {
    width: 100%;
    overflow: hidden;
    margin: 20px;
  }

  .inner {
    display: inline-flex;
    align-items: baseline;
    transition: 0.3s all ease;
    width: 100%;
  }
  .inner.active {
      cursor: grab;
  }
  .slides{
    display: flex;
    justify-content: center;
  }
  img {
    width: 150px;
    height: 150px;
  }

  .carousel-nav {
    position: absolute;
    display: flex;
    justify-content: space-between;
    width: 105%;
  }
  .testimonials-carousel{
      width: 100%;
      top: 45%;
  }
  svg {
    fill: rgb(178, 178, 215);
  }

  button {
    background-color: unset;
    background-size: contain;
    background-repeat: no-repeat;
    width: 30px;
    height: 30px;
    border: none;
    font-size: 0;
    cursor: pointer;
  }
  .prev{
    padding-right: 0;
    padding-left: 20px;
  }
  .next{
    padding-right: 20px;
    padding-left: 0;
  }
  .carousel-dots-wrapper {
    width: 100%;
    position: absolute;
    bottom: 0;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .carousel-dot {
    padding: 0;
    width: 7px;
    height: 7px;
    border-radius: 15px;
    background-color: rgb(175, 172, 172);
    border: none;
    margin: 3px;
    cursor: pointer;
    transition: 0.2s all linear;
  }
  .carousel-dot.active {
    background-color: rgb(200, 200, 225);
    width: 20px;
  }
</style>