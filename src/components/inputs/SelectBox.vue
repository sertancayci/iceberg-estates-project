<template>

    <div class="select-container my-3 date-input-container flex flex-row justify-between items-end border border-gray-400 rounded-lg p-1 px-3 pt-0 h-12"
        @click="toggleDropdown">
        <div class="flex flex-col">
            <label :for="label" class="date-label text-xs text-gray-900">{{ label }}</label>
            <div class="selected-value" :class="{ 'is-active': dropdownOpen }">
                {{ selectedOption[labelKey] || placeholder }}
            </div>
            <div v-if="dropdownOpen" class="options-list">

                <option v-for="option in options" :key="option.id" class="option" @click.stop="selectOption(option)">
                    {{ option[labelKey] }}
                    {{ option[labelSubKey] ? option[labelSubKey] : '' }}
                </option>
            </div>
        </div>
        <!-- <select required>
            <option disabled value="">Select Agent</option>
            <option v-for="option in options" :key="option.id" :value="option.id">

                {{ option[labelKey] }}
                {{ option[labelSubKey] ? option[labelSubKey] : '' }}
            </option>
        </select> -->

    </div>
</template>

<script>
import { ref } from 'vue';

const dropdownOpen = ref(false);

export default {
    name: 'SelectBox',
    props: {
        options: {
            type: Array,
            default: () => []  // Ensure default is an empty array
        },
        label: String,
        placeholder: String,
        modelValue: [String, Number, Object],
        labelKey: String,
        labelSubKey: String
    },
    data() {
        return {
            selectedOption: {}
        };
    },
    watch: {
        modelValue: {
            immediate: true,
            handler(value) {
                this.selectedOption = this.options.find(option => option.id === value) || {};
            }
        }
    },
    mounted() {
        console.log('mounted', this.options)
    },
    methods: {
        toggleDropdown() {
            console.log('toggleDropdown', dropdownOpen.value)
            dropdownOpen.value = !dropdownOpen.value;
        },
        selectOption(option) {
            selectedOption.value = option;
            emit('update:modelValue', option.id);
            dropdownOpen.value = false;
        },
    },
};
</script>


<style scoped>
.select-container {
    position: relative;
    border: 1px solid #ccc;
    border-radius: 8px;
    cursor: pointer;
}

.selected-value {
    padding: 8px;
    background: #f9f9f9;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.selected-value.is-active {
    background: #e0e0e0;
    /* Active state background */
}

.options-list {
    width: 100%;
    background: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10;
}

.option {
    padding: 8px;
    border-top: 1px solid #eee;
    background: #FFF;
    transition: background 0.3s;

    &:hover {
        background: #f0f0f0;
    }
}
</style>