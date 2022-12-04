<template>
  <div class="container">
    <nav>
        <NuxtLink to="/">
            <button class="navButton">Home</button>
        </NuxtLink>
        <NuxtLink to="/blogs">
          <button class="navButton">Blogs</button>
        </NuxtLink>
    </nav>
    <img :src="'http://localhost:1337' + products[index].imageUrl" alt="">
    <h2>{{products[index].title}}</h2>
    <p>{{products[index].content}}</p>
  </div>
</template>

<script>
export default {
  computed: {
    products() {
        return this.$store.state.test.products;
    },
    index() {
      return this.$route.params.id - 1
    }
  },
  async fetch() {
      await this.$store.dispatch("test/getProductData");
  },

  created() {
    console.log(this.$route.params.id, 'this is params')
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
img {
  margin: 10px 0;
  width: 200px;
}
p {
  max-width: 600px;
  text-align: center;
  font-size: 20px;
}

</style>