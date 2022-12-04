<template>
  <div class="container">
    <div>
        <slot></slot>
    </div>
    <ul class="buttonContainer">
        <li><button class="prev" @click="switchToPrev" :disabled="isInFirstPage">&lt;</button></li>
        <li><button @click="switchToFirstPage" v-if="firstPageAllowed">1</button></li>
        <span v-if="isPageNumberlargerThanThree">...</span>
        <li v-for="page in pages" :key="page.name">
            <button @click="switchToPage(page.name)" :disabled="page.isDisabled">
                {{page.name}}
            </button>
        </li>
        <span v-if="isPageNumberSmallerThanTen">...</span>
        <li><button @click="switchToLastPage" v-if="lastPageAllowed">{{totalPages}}</button></li>
        <li><button class="next" @click="switchToNext" :disabled="isInLastPage">&gt;</button></li>
    </ul>
  </div>
</template>

<script>
export default {
    props: {
        perPage: Number,
        totalPages: Number,
        currentPage: Number
    },
    data() {
        return{
            maxVisibleButtons: 3,
        }
    },
    computed: {
        products() {
            return this.$store.state.test.products;
        },
        startPage() {
            if(this.currentPage === 1) {
                return 1
            }
            if(this.currentPage === this.totalPages) {
                return this.totalPages - 2
            }
            return this.currentPage - 1
        },
        pages() {
            const range = []
            for(let i = this.startPage; i <= Math.min(this.startPage + this.maxVisibleButtons - 1, this.totalPages); i++) {
                range.push({
                    name: i,
                    isDisabled: i === this.currentPage
                })
            }
            return range
        },
        isInFirstPage() {
            if(this.currentPage === 1) {
                return true
            }
        },
        isInLastPage() {
            if(this.currentPage === this.totalPages) {
                return true
            }
        },
        firstPageAllowed() {
            if(this.currentPage >= 3) {
                return true
            } else{
                return false
            }
        },
        isPageNumberlargerThanThree() {
            if(this.currentPage > 3) {
                return true
            } else{
                return false
            }
        },
        isPageNumberSmallerThanTen() {
            if(this.currentPage < this.totalPages - 2) {
                return true
            } else{
                return false
            }
        },
        lastPageAllowed() {
            if(this.currentPage <= this.totalPages - 2) {
                return true
            } else{
                return false
            }
        }
    },

    methods: {

        switchToPrev() {
            this.$emit('pagechanged', this.currentPage - 1);
        },

        switchToFirstPage() {
            this.$emit('pagechanged', 1);
        },

        switchToPage(page) {
            this.$emit('pagechanged', page);
        },

        switchToLastPage() {
            this.$emit('pagechanged', this.totalPages);
        },

        switchToNext() {
            this.$emit('pagechanged', this.currentPage + 1);
        }
    },
    mounted() {
        // console.log(this.startPage, 'this is startPage');
        // console.log(this.pages, 'this is pages');
        // console.log(this.currentPage, 'this is current page');
        
    }
}
</script>

<style>
button {
    cursor: pointer;
    padding: 10px;
    margin: 2px;
}
.buttonContainer {
    list-style: none;
    display: flex;
    align-items: center;
}
span {
    font-size: 20px;
}
</style>