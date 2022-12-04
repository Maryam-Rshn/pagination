<template>
  <div class="container">
    <nav>
      <NuxtLink to="/blogs">
        <button class="navButton">Blogs</button>
      </NuxtLink>
    </nav>
    <Carousel :optionsObject="optionsObject">
      <div class="slides" v-for="product in products" :key="product.id">
        <NuxtLink :to="{name: 'blogs-id', params: {id: product.id } }">
          <div>
            <img :src="link + product.imageUrl" alt="">
          </div>
        </NuxtLink>
      </div>
    </Carousel>
  </div>
</template>

<script>
import Carousel from '../components/Carousel.vue'
export default {
  components: { Carousel },
  name: 'IndexPage',
  data() {
    return {
      optionsObject : {
        // breakpoint: 1200,
        itemsPerSlide: 2,
        itemsPerStep: 2,
        loop: true,
        dots: true,
        itemsMargin: null,
        arrows: true
      },
      link: "http://localhost:1337",
    }
  },
  computed: {
      products(){
          return this.$store.state.test.products.filter((product) => {
            return product.id <= 6
          });
      }
  },
  async fetch () {
      await this.$store.dispatch('test/getProductData')
  },
}
</script>

<style>
.navButton {
  border: none;
  padding: 10px;
  font-size: 10pxs;
  background: rgb(215, 215, 234);
  border-radius: 5px;
  margin-bottom: 40px;
  cursor: pointer;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
