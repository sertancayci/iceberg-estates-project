<template>
    <div @click="focusInput"
        class="bg-white flex flex-row justify-between items-center border focus:outline-none border-gray-400 rounded-lg p-1 px-3 pt-0 h-12 mt-3">
        <div class="flex flex-col w-full bg-white">
            <label :for="id" class="date-label text-xs text-gray-900">{{ label }}</label>
            <input type="text" :ref="id" :id="id" v-model="localValue" @input="handleInput"
                class="form-control bg-white w-full h-6 text-sm font-semibold placeholder:text-black placeholder:text-sm focus:outline-none">
        </div>
        <div name="icon">
            <!-- Default icon slot -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                class="w-6 h-6 text-gray-600">
                <path
                    d="M11.47 3.841a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.061l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 101.061 1.06l8.69-8.689Z" />
                <path
                    d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.432Z" />
            </svg>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AddressInput',
    props: {
        modelValue: String,
        label: {
            type: String,
            default: 'Address'
        },
        id: {
            type: String,
            required: true
        }
    },
    emits: ['update:modelValue'],
    data() {
        return {
            localValue: this.modelValue
        };
    },
    watch: {
        modelValue(newVal) {
            this.localValue = newVal;
        },
        localValue(newVal) {
            this.$emit('update:modelValue', newVal);
        }
    },
    methods: {
        focusInput() {
            this.$refs[this.id].focus();
        },
        handleInput(event) {
            this.$emit('input', event.target.value);
        }
    }
}
</script>

<style scoped>

</style>
