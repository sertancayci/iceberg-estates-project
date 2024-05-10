<template>

    <form class="w-full">
        <div class="flex">
            <div class="relative w-full">
                <input type="search" v-model="searchTerm" @input="emitSearch"
                    class="block p-2.5 w-full h-12 z-20 text-sm text-gray-900 rounded-l-lg border rounded-r-lg border-gray-400 focus:outline-none focus:ring-gray-300 focus:border-black placeholder:-translate-x-[-40%] placeholder:text-black"
                    placeholder="Search..." required />
                <button type="submit"
                    class="absolute top-0 end-0 h-full p-2.5 text-sm font-medium text-white bg-black rounded-r-lg border border-gray-400 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-400">
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                    <span class="sr-only">Search</span>
                </button>
            </div>
        </div>
    </form>



</template>

<script>
import { ref } from 'vue';

export default {
    name: 'SearchBar',
    setup(_, { emit }) {
        const searchTerm = ref('');

        const emitSearch = () => {
            // Emit the search term whenever the input changes
            emit('search', searchTerm.value);
        };

        return { searchTerm, emitSearch };
    }
};
</script>