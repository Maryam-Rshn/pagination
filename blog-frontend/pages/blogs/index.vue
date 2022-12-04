<template>
  <div class="container">
    <nav>
        <NuxtLink to="/">
            <button class="navButton">Home</button>
        </NuxtLink>
    </nav>
    <Pagination :perPage="perPage" :totalPages="totalPages" :currentPage= "currentPage" @pagechanged="onPageChange">
        <div v-for="product in newProducts" :key="product.id">
            <NuxtLink :to="{name: 'blogs-id', params: {id: product.id } }" class="nuxtLink">
                <div>
                    <img :src="link + product.imageUrl" alt="">
                    <h2>{{product.title}}</h2>
                </div>
            </NuxtLink>
        </div>
    </pagination>
  </div>
</template>

<script>
import Pagination from '~/components/Pagination.vue';

export default {
    
    components: { Pagination },
    data() {
        return {
            link: "http://localhost:1337",
            totalItems: null,
            perPage: 1,
            totalPages: null,
            currentPage: 1,
            newProducts: [],
        };
    },
    computed: {
        products() {
            return this.$store.state.test.products;
        }
    },
    async fetch() {
        await this.$store.dispatch("test/getProductData");
    },
    methods: {
        onPageChange(page) {
            this.currentPage = page;
            this.$router.push({path: this.$route.path, query: { page: this.currentPage }})
            localStorage.setItem('currentPage', JSON.stringify(this.currentPage))
            this.pickProducts(this.currentPage, this.perPage)
             
            
        },
        pickProducts(page, limit) {
            this.newProducts = []
            const start = (page-1) * limit
            const picker = page * limit
            for(let i = start; i < picker; i++) {
                this.newProducts.push(this.products[i])
                
            }
        }
    },

    mounted() {
        this.totalItems = this.products.length
        this.totalPages = Math.ceil(this.totalItems / this.perPage)
        if(localStorage.getItem('currentPage')) {
            this.currentPage = JSON.parse(localStorage.getItem('currentPage'))
            this.$router.push({path: this.$route.path, query: { page: this.currentPage }})
        }
        this.pickProducts(this.currentPage, this.perPage)
    }
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
.nuxtLink {
    text-decoration: none;
    color: black;
}


</style>