<script>
import * as dataJson from '../../cfg.json';

const username = dataJson.username
const password = dataJson.password
const headers = new Headers();
headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));


export default {
    props: {
        data: Array,
        columns: Array,
        filterKey: String,
    },
    data() {
        return {
            sortKey: '',
            sortOrders: this.columns.reduce((o, key) => ((o[key] = 1), o), {})
        }
    },
    computed: {
        filteredData() {
            const sortKey = this.sortKey
            const filterKey = this.filterKey && this.filterKey.toLowerCase()
            const order = this.sortOrders[sortKey] || 1
            let data = this.data
            if (filterKey) {
                data = data.filter((row) => {
                    return Object.keys(row).some((key) => {
                        return String(row[key]).toLowerCase().indexOf(filterKey) > -1
                    })
                })
            }
            if (sortKey) {
                data = data.slice().sort((a, b) => {
                    a = a[sortKey]
                    b = b[sortKey]
                    return (a === b ? 0 : a > b ? 1 : -1) * order
                })
            }
            return data
        }
    },
    methods: {
        padTo2Digits(num) {
            return num.toString().padStart(2, '0');
        },
        formatDate(date) {
            return [
                date.substring(8, 11),
                date.substring(5, 7),
                date.substring(0, 4),
            ].join('/');
        },
        sortBy(key) {
            this.sortKey = key
            this.sortOrders[key] = this.sortOrders[key] * -1
        },
        capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1)
        },
    }
}
</script>

<template>
    <table v-if="filteredData.length">
        <thead>
            <tr>
                <th v-for="key in columns" @click="sortBy(key)" :class="{ active: sortKey == key }">
                    {{ capitalize(key) }}
                    <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
                    </span>
                </th>
                <th>
                    Deletar
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="entry in filteredData">
                <td :class="key === 'status' ? 'text-center' : ''" v-for="key in columns">
                    <span v-if="entry[key] === 'download'"><a
                            :href="`download?imgName=${entry['nome']}]${entry['data']}]${entry['imagem']}]${entry['db3']}]${entry['ovpn']}]${entry['appdb3']}${entry['appdb3'] == '' ? '' : ']'}.img`">
                            <img src="../assets/download.png" width="30" alt="Download"
                                class="download-icon" /></a></span>
                    <span v-else-if="entry[key] === 'loading'">
                        <iframe src="https://giphy.com/embed/sSgvbe1m3n93G" width="30" height="30" frameBorder="0"
                            class="giphy-embed" allowFullScreen>
                        </iframe>
                    </span>
                    <span v-else>{{ key == 'data' ? formatDate(entry[key]) : entry[key] }}</span>
                </td>
                <td class="text-center">
                    <a
                        :href="`delete?imgName=${entry['nome']}]${entry['data']}]${entry['imagem']}]${entry['db3']}]${entry['ovpn']}]${entry['appdb3']}${entry['appdb3'] == '' ? '' : ']'}.img`">
                        <img src="../assets/delete.png" width="30" alt="Download" class="download-icon" /></a>
                </td>
            </tr>
        </tbody>
    </table>
    <p v-else>No matches found.</p>
</template>

<style>
table {
    border: 2px solid #0091ea;
    border-radius: 3px;
    background-color: #fff;
    margin-top: 1em;
    width: 100%;
}

th {
    background-color: #0091ea;
    color: rgba(255, 255, 255, 0.66);
    cursor: pointer;
    user-select: none;
}

td {
    background-color: #f9f9f9;
}

th,
td {
    min-width: 120px;
    padding: 10px 20px;
}

th.active {
    color: #fff;
}

th.active .arrow {
    opacity: 1;
}

.arrow {
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 0;
    margin-left: 5px;
    opacity: 0.66;
}

.arrow.asc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid #fff;
}

.arrow.dsc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid #fff;
}

.download-icon:hover {
    transform: scale(1.25, 1.25);
    transition-duration: 300ms;
}
</style>