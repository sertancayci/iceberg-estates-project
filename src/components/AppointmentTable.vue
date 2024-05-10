<template>
    <div @click="emitEdit(appointment)"
        class="grid grid-cols-12 items-center p-4 bg-white rounded-lg border border-gray-400 mb-4 cursor-pointer">
        <div class="col-span-12 sm:col-span-6 lg:col-span-3 flex items-center justify-start">
            <div class="pl-9">
                <div class="flex"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-gray-500">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    <p class="text-[#171717] pl-8 font-semibold"> {{ appointment.contact_name[0] }} {{
                        appointment.contact_surname[0] }}
                    </p>
                </div>
                <div class="text-gray-500 flex mt-1"> <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-gray-500">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                    <p class="pl-8">{{ appointment.contact_email[0] }}</p>
                </div>
                <div class="text-gray-500 flex mt-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-gray-500">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                    <p class="pl-8"> {{ appointment.contact_phone[0] }}</p>
                </div>

            </div>
        </div>
        <div class="col-span-12 sm:col-span-6 lg:col-span-3 flex">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-6 h-6 text-gray-500 flex-shrink-0">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>

            <p class="text-[#171717] pl-6 font-semibold">{{ appointment.appointment_address }}</p>
        </div>
        <div
            class="col-span-12 sm:col-span-6 lg:col-span-3 bg-[#ec1e80] border radius-xl flex flex-row justify-between rounded-lg p-1  w-[23rem]">
            <div class="flex ml-1 px-3 py-2 rounded-lg bg-white w-[10rem] "
                :class="{ 'justify-between': appointmentStatus.statusText === 'Upcoming', 'justify-center': appointmentStatus.statusText !== 'Upcoming' }">
                <span class="text-center font-semibold text-sm" :class="`${appointmentStatus.color}`">
                    {{ appointmentStatus.statusText }}

                </span>
                <span class="text-[#727272] font-semibold text-sm text-center">
                    {{ appointmentStatus.timeLeft }}
                </span>
            </div>
            <p class="text-white font-semibold place-self-center pr-6"> {{ formatDate(appointment.appointment_date) }}
            </p>

        </div>
        <div class="col-span-12 sm:col-span-6 lg:col-span-3 justify-center items-center flex -space-x-2 mt-2">
            <AgentsTag :agents="appointmentAgentDetails" :displayCount="4" />
        </div>
    </div>
</template>

<script>
import AirtableService from '../api/AirtableService';
import AgentsTag from './AgentsTag.vue';

export default {
    name: 'AppointmentTable',
    props: {
        appointment: Object
    },
    components: {
        AgentsTag
    },
    data() {
        return {
            appointmentAgentDetails: []
        };
    },
    computed: {
        appointmentStatus() {
            const now = new Date();
            const appointmentDate = new Date(this.appointment.appointment_date);

            if (this.appointment.is_cancelled) {
                return { statusText: 'Cancelled', timeLeft: '', color: 'text-red-500' };
            } else if (appointmentDate < now) {
                return { statusText: 'Completed', timeLeft: '', color: 'text-green-500' };
            } else {
                const timeLeft = this.calculateTimeLeft(appointmentDate, now);
                return { statusText: 'Upcoming', timeLeft, color: 'text-yellow-500' };
            }
        }
    },
    methods: {
        emitEdit(appointment) {
            this.$emit('edit', appointment);
        },
        formatDate(date) {
            const dateObj = new Date(date);
            const formattedDate = dateObj.toLocaleDateString('en-GB', {
                year: 'numeric', month: '2-digit', day: '2-digit'
            });
            const formattedTime = dateObj.toLocaleTimeString('en-GB', {
                hour: '2-digit', minute: '2-digit', hour12: false
            });
            return `${formattedDate} ${formattedTime}`;
        },
        calculateTimeLeft(appointmentDate, now) {
            const diff = appointmentDate - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

            if (days > 0) {
                return `${days} day${days > 1 ? 's' : ''}`;
            } else {
                return `${hours} hour${hours !== 1 ? 's' : ''}`;
            }
        },
        async fetchAgentDetails(appointmentAgentIds) {
            const agentIds = appointmentAgentIds;
            this.appointmentAgentDetails = await AirtableService.getAgentsDetails(agentIds);
        },
    },
    onMounted() {
        this.fetchAgentDetails();
    },
    created() {
        if (this.appointment.agent_id) {
            this.fetchAgentDetails(this.appointment.agent_id);
        }
    },
};
</script>

<style scoped>
/* Tooltip text */
.tooltip .tooltiptext {
    visibility: hidden;
    background-color: #fffbfb;
    color: #837a7a;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;
    position: absolute;
    z-index: 1;
    margin-bottom: 3rem;
    margin-left: 3rem;

    /* Position the tooltip text - see examples below! */
    position: absolute;
    z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
    visibility: visible;
}
</style>