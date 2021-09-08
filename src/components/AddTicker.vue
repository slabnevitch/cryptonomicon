<template>
	<section>
        <div class="flex">
          <div class="max-w-xs">
            <!-- {{autocompleteArray}} -->
            <!-- <p>{{autocompleteArray.length}}</p> -->
            <label for="wallet" class="block text-sm font-medium text-gray-700"
              >Тикер</label
            >
            <div class="mt-1 relative rounded-md shadow-md">
              <input
                v-model="ticker"
                @keydown.enter="add"
                @input="tickerInput"
                type="text"
                name="wallet"
                id="wallet"
                class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                placeholder="Например DOGE"
              />
            </div>
            <div
              v-if="autocompleteArray.length" 
              class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"><!-- добавили -->
              <span
                v-for="(item, ind) in autocompleteArray"
                :key="ind" 
                @click="autocompleteItemClick(item.Symbol)"
               class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
                {{item.Symbol}}
              </span>
              <!-- <span class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
                DOGE
              </span>
              <span class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
                BCH
              </span>
              <span class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
                CHD
              </span> -->
            </div>
            <div class="text-sm text-red-600"
                  v-show="nameExist">Такой тикер уже добавлен</div><!-- КОНЕЦ добавили -->

          </div>
        </div>
        <add-button
        	@click="add"
			:disabled="disabled"
			:class="{'opacity-50': disabled}">
		</add-button>
      </section>
</template>

<script>
	import AddButton from './AddButton.vue'
export default {
	components:{
		'add-button': AddButton
	},
  name: 'Add',
  props: {
  	disabled:{
  		type: Boolean,
  		required: false,
  		default: false
  	},
  	loadedTickersList:{
  		type: Array,
  		required: true
  	}
  },

  data () {
    return {
    	ticker: '',
    	autocompleteArray: [],
    	nameExist: false

    }
  },
  emits: {
  	'add': value => typeof value === 'string' // валидация значения, передаваемого родителю через польз-е. событие
  },
  methods: {
    add () {
    	if(this.ticker.length == 0) return;
      this.$emit('add', this.ticker);
    },
    tickerInput(){
      console.log(this.ticker);
      this.nameExist = false;

      if(this.ticker !== ''){

       this.autocompleteArray = this.loadedTickersList.filter(item => item.Symbol.toLowerCase().indexOf(this.ticker.toLowerCase()) != -1)
          .sort((a, b) => {
            if(a.Symbol < b.Symbol) return -1;
            if(a.Symbol > b.Symbol) return 1;
            return 0;
          }).slice(0, 4) 
      }else{
        this.autocompleteArray = []
      }
    },
    autocompleteItemClick(name){
        this.ticker = name;
        this.autocompleteArray = [];
        this.add();
    }
  }
}
</script>

<style lang="scss" >
</style>