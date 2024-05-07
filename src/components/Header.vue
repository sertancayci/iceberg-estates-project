<template>
    <div class="grid grid-cols-12 md:px-5 py-4 bg-white shadow">
        <!-- Tags and Status Select -->
        <div class="col-span-12 md:col-span-6 lg:col-span-2 flex items-center flex-wrap group  lg:mt-[-0.25rem]">
            <AgentsTag :agents="allAgents" :selectable="true" @agent-selected="handleSelectedAgents" />
        </div>

        <div class="col-span-12 md:col-span-6 lg:col-span-2">
            <select v-model="selectedStatus" @change="handleStatusChange"
                class="h-12 w-full rounded-lg border border-solid border-neutral-300 px-4 text-sm font-semibold">
                <option value="all">All Statuses</option>
                <option value="cancelled">Cancelled</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
            </select>
        </div>
        <!-- Date Range Picker -->
        <div class="col-span-12 md:col-span-6 lg:col-span-3 lg:ml-2.5 gap-x-2">
            <div class="flex gap-x-2">
                <DatePicker label="From:" ref-name="startDateInput" :model-value="startDate"
                    @update:modelValue="handleStartDateChange" />
                <DatePicker label="To:" ref-name="endDateInput" :model-value="endDate"
                    @update:modelValue="handleEndDateChange" />
            </div>
        </div>
        <!-- Search Bar -->
        <div class="relative col-span-12 md:col-span-6 lg:col-span-5 flex justify-self-end">
            <SearchBar @search="handleSearch" />
        </div>
    </div>
</template>

<script>
import DatePicker from './inputs/DatePicker.vue';
import AirtableService from '../api/AirtableService';
import SearchBar from './SearchBar.vue';
import AgentsTag from './AgentsTag.vue';

import 'flatpickr/dist/themes/light.css';

export default {
    name: 'Header',
    props: {
        handleSelectedAgentsChange: Function,
        handleSearch: Function, // Define handleSearch as a prop
    },
    components: {
        SearchBar,
        AgentsTag,
        DatePicker
    },
    data() {
        return {
            selectedStatus: 'all',
            startDate: '',
            endDate: '',
            searchQuery: '',
            allAgents: [],
            selectedAgentIds: []
        };
    },
    watch: {
        currentStatus(newStatus) {
            this.$emit('status-change', newStatus);
        }
    },
    methods: {
        openDatePicker(picker) {
            if (this[picker]) {
                this[picker].open();
            }
        },
        tagClass(color) {
            return `w-10 h-10 text-xs font-bold z-0 hover:z-50 rounded-[50%] text-white relative cursor-pointer flex justify-center items-center  ${color}`;
        },

        handleSearch(query) {
            this.searchQuery = query;
            console.log("searchQuery", this.searchQuery);
            this.$emit('search', this.searchQuery);
        },

        handleStatusChange() {
            console.log("selectedStatus", this.selectedStatus);
            this.$emit('status-change', this.selectedStatus);
        },

        async fetchAgentDetails() {
            this.allAgents = await AirtableService.getAgentsDetails();
            // console.log("allAgents", this.allAgents);
        },

        handleSelectedAgents(agentId) {
            const index = this.selectedAgentIds.indexOf(agentId);
            if (index === -1) {
                this.selectedAgentIds.push(agentId);
            } else {
                this.selectedAgentIds.splice(index, 1);
            }

            this.$emit('selected-agents-change', this.selectedAgentIds);
        },
        handleStartDateChange(date) {
            this.startDate = date;
            this.onDateChange();
        },
        handleEndDateChange(date) {
            this.endDate = date;
            this.onDateChange();
        },
        onDateChange() {
            this.$emit('date-change', { startDate: this.startDate, endDate: this.endDate });
        },
    },

    created() {
        this.fetchAgentDetails();
    },
};
</script>

<style scoped></style>