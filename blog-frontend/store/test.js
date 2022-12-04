import axios from "axios";


export const state = () =>({
    products: []
})

export const mutations = {
    setProductData(state, productData) {
        state.products = productData.map(product => {
            return {
              slug: product.slug,
              id: product.id,
              title: product.attributes.title,
              content: product.attributes.content,
              imageUrl: product.attributes.image.data[0].attributes.formats.thumbnail.url,
            };
          });
    }
}


export const actions = {
    async getProductData({ commit }) {
      try{
        // const pageSize = 1;
        const response = await axios.get('http://localhost:1337/api/products?populate=*');
        const content = response.data.data;
        // const count = content.length;
        // const totalPage = Math.ceil(count / pageSize)
        commit("setProductData", content)
      } catch(error) {
        throw error
      }
  },
}  
