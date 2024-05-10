<template>
    <div class="pagination-container">
        <div class="cursor-pointer border border-gray-400 bg-gray-100 text-gray-600 rounded-lg p-2" @click="handlePrevious"
            :disabled="currentPage <= 1"
            :class="{ ' bg-gray-50 text-gray-300 font-semibold border-gray-200 cursor-not-allowed ': currentPage <= 1 }">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-3 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
        </div>
        <div class="flex text-center justify-center items-center cursor-pointer border border-gray-400 bg-gray-100 text-gray-700 rounded-lg w-[1.85rem] h-[2.1rem]"
            v-for="page in pageNumbers" :key="page" @click="handlePageChange(page)" :disabled="!hasNext"
            :class="{ 
                'bg-transparent font-semibold border-gray-700': currentPage === page,
                ' bg-gray-50 text-gray-400 font-semibold border-gray-200 cursor-not-allowed ': !hasNext 
             }">
            <p>{{ page }}</p>
        </div>
        <div class="cursor-pointer border border-gray-400 bg-gray-100 text-gray-700 rounded-lg p-2" @click="handleNext" :disabled="!hasNext"
            :class="{ ' bg-gray-50 text-gray-400 font-semibold border-gray-200 cursor-not-allowed ': !hasNext }">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-3 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        currentPage: Number,
        hasNext: Boolean,
        totalPages: Number,
    },
    methods: {
        handlePrevious() {
            if (this.currentPage > 1) {
                this.$emit('change', this.currentPage - 1);
            }
        },
        handleNext() {
            if (this.hasNext) {
                this.$emit('change', this.currentPage + 1);
            }
        },
        handlePageChange(page) {

            this.$emit('change', page);
        }
    },
    computed: {
        pageNumbers() {
            const pages = [];
            for (let i = 1; i <= this.totalPages; i++) {
                if (i === 1 || i === this.currentPage || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                    pages.push(i);
                } else if (i < this.currentPage - 1 && pages[pages.length - 1] !== '...') {
                    pages.push('...');
                }
            }
            return pages;
        }
    }
};
</script>

<style scoped>
.pagination-container {
    display: flex;
    justify-content: end;
    align-items: center;
    gap: 10px;
}

button {
    cursor: pointer;
}

button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.font-bold {
    font-weight: bold;
}
</style>