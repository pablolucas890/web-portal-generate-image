<script>
import Container from './Container.vue'
import Input from './Input.vue';
import Select from './Select.vue';
import DataTable from './DataTable.vue';
import * as dataJson from '../../cfg.json';
import axios from 'axios'

const username = dataJson.username
const password = dataJson.password
const headers = new Headers();
headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));


export default {
  components: {
    Container,
    Input,
    Select,
    DataTable
  },
  data() {
    return {
      isSendForm: false,
      preenchido: false,
      image_bases: [],
      selected_image_base: '',
      imageName: '',
      db3File: null,
      ovpnFile: null,
      Appdb3File: null,
      searchQuery: '',
      gridColumns: ['nome', 'data', 'status', 'imagem', 'db3', 'ovpn', 'appdb3'],
      gridData: []
    }
  },
  methods: {
    padTo2Digits(num) {
      return num.toString().padStart(2, '0');
    },
    formatDate(date) {
      return [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
      ].join('-');
    },
    listImageBase() {
      fetch(`http://${dataJson.bind}:${dataJson.port}/list-base-images`, {
        method: 'GET',
        headers: headers,
      }).then(response => response.json())
        .then(json => {
          this.image_bases = json
        });
    },
    listGridData() {
      fetch(`http://${dataJson.bind}:${dataJson.port}/list-generated-images`, {
        method: 'GET',
        headers: headers,
      }).then(response => response.json())
        .then(json => {
          for (let i = 0; i < json.length; i++) {
            const element = json[i];
            const celGrid = {
              nome: element.split(']')[0],
              data: element.split(']')[1],
              status: 'download',
              imagem: element.split(']')[2],
              db3: element.split(']')[3],
              ovpn: element.split(']')[4],
              appdb3: element.split(']')[5] === '.img.gz' ? '' : element.split(']')[5],
            }
            this.gridData.push(celGrid)
          }
        });
    },
    sendFiles() {
      let files = new FormData();
      files.append('files', this.db3File)
      files.append('files', this.ovpnFile)
      if (this.Appdb3File !== null) {
        if (this.Appdb3File !== undefined) {
          files.append('files', this.Appdb3File)
        }
      }
      axios.post(`http://${dataJson.bind}:${dataJson.port}/upload`, files, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        auth: {
          username: username,
          password: password
        }
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    todosPreenchidos() {
      if (this.selected_image_base === '' || this.imageName === '') {
        this.preenchido = false;
      } else {
        if (this.db3File === null || this.ovpnFile === null) {
          this.preenchido = false;
        } else {
          if (this.db3File.name === undefined || this.ovpnFile.name === undefined) {
            this.preenchido = false
          } else {
            this.preenchido = true
          }
        }
      }
    },
    generateImage() {
      if (this.preenchido) {
        this.imageName = this.imageName.replaceAll(' ', '-')
        this.imageName = this.imageName.replaceAll('/', '-')
        this.imageName = this.imageName.replaceAll('\\', '-')
        this.imageName = this.imageName.replaceAll(']', '-')

        let imageName = this.imageName + ']' + this.formatDate(new Date()) + ']' + this.selected_image_base + ']' + this.db3File.name + ']' + this.ovpnFile.name;
        this.Appdb3File === null ? (imageName = imageName) : (this.Appdb3File.name === undefined ? (imageName = imageName) : (imageName += ']' + this.Appdb3File.name))
        imageName += '].img'

        this.sendFiles()

        fetch(`http://${dataJson.bind}:${dataJson.port}/create-image?image_name=${imageName}`, {
          method: 'GET',
          headers: headers,
        }).then(response => response.json())
          .then(json => {
            //Colocar alert de sucesso ou erro
          });
        window.location.reload();
      } else {
        if (this.$refs.alert.className.includes('2')) {
          this.$refs.alert.className = 'visible visible-transform'
        } else {
          this.$refs.alert.className = 'visible visible-transform2'
        }
      }
    },
  },
  watch: {
    selected_image_base() {
      this.todosPreenchidos();
    }
  },
  async created() {
    this.listImageBase()
    this.listGridData()
  },
}
</script>

<template>
  <Container class="global-container">
    <Container class="first-container">
      <div class="row mb-md-3">
        <div class="col-12 col-md-7">
          <h2 class="title text-blue barlow-medium">Sistema de Geração de Imagem</h2>
        </div>
        <div class="col-0 col-md-2"></div>
        <div class="col-12 col-md-3 text-center">
          <img src="../assets/logo.png" width="200" class="float-right" alt="Controllar">
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <Select @click="this.todosPreenchidos()" @change="this.todosPreenchidos()" title="Selecione uma Imagem Base: "
            name="Boards" :options="image_bases"
            @response="(selectedItem) => selected_image_base = selectedItem"></Select>
        </div>
        <div class="col-md-6">
          <Input @change="this.todosPreenchidos()" title="Nome da Imagem: " inputType="text"
            @response="(imageNameChild) => imageName = imageNameChild"></Input>
        </div>
      </div>
      <Container class="mt-4 mb-4 p-4 second-containder">
        <h5 class="barlow-medium mb-3">Arquivos de usuário:</h5>
        <div class="row">
          <div class="col-md-4">
            <Input @change="this.todosPreenchidos()" title="Arquivo .db3: " fileType=".db3" inputType="file"
              @response="(db3) => db3File = db3"></Input>
            <span class="selected-text ">{{ db3File === null ? '' : (db3File.name === undefined ? '' : `Selecionado:
                          ${db3File.name}`)
            }}</span>
          </div>
          <div class="col-md-4">
            <Input @change="this.todosPreenchidos()" title="Arquivo .ovpn:" fileType=".ovpn" inputType="file"
              @response="(ovpn) => ovpnFile = ovpn"></Input>
            <span class="selected-text ">{{ ovpnFile === null ? '' : (ovpnFile.name === undefined ? '' : `Selecionado:
                          ${ovpnFile.name}`)
            }}</span>
          </div>
          <div class="col-md-4">
            <Input title="Arquivo App.deb3 (Opcional):" fileType=".db3" inputType="file"
              @response="(appdb3) => Appdb3File = appdb3"></Input>
            <span class="selected-text ">{{ Appdb3File === null ? '' : (Appdb3File.name === undefined ? '' :
                `Selecionado: ${Appdb3File.name}`)
            }}</span>
          </div>
        </div>
      </Container>
      <div>
        <button @click="generateImage">Gerar Imagem</button>
        <span ref="alert" :class="preenchido ? 'invisible' : 'visible'">
          Preencha todos os campos *
        </span>
      </div>
    </Container>
    <Container class="table-container">
      <form id="search">
        <h5 class="search">Pesquisar:</h5> <input class="search-input" name="query" v-model="searchQuery">
      </form>
      <DataTable :data="gridData" :columns="gridColumns" :filter-key="searchQuery">
      </DataTable>
    </Container>
  </Container>
</template>
<style>
.first-container {
  padding: 2em;
}

.table-container {
  margin-top: 2em;
  padding: 2em;
}

.global-container {
  padding: 1em;
  box-shadow: inset 0 1em 2em #e9e9e9;
}

.invisible {
  visibility: true;
  font-family: barlow-medium;
  color: red;
  font-size: .8em;
  margin-left: 1em;
}

.visible {
  visibility: false;
  font-family: barlow-medium;
  color: red;
  font-size: .8em;
  margin-left: 1em;
}

.search-input {
  width: 100% !important;
}

.visible-transform {
  animation-name: slidein;
  animation-duration: 0.4s;
  animation-iteration-count: 2;
}

.visible-transform2 {
  animation-name: slidein2;
  animation-duration: 0.4s;
  animation-iteration-count: 2;
}

@keyframes slidein {
  0% {
    opacity: 0;
    font-size: .8em;
  }

  50% {
    opacity: 1;
    font-size: 1em;
  }

  100% {
    opacity: 0;
    font-size: .8em;
  }
}

@keyframes slidein2 {
  0% {
    opacity: 0;
    font-size: .8em;
  }

  50% {
    opacity: 1;
    font-size: 1em;
  }

  100% {
    opacity: 0;
    font-size: .8em;
  }
}

.title {
  font-size: 2.25em;
}

.selected-text {
  font-family: barlow-medium;
  font-size: .9em;
}

.second-containder {
  box-shadow: inset .25em .25em 1em #e9e9e9;
}

h5 {
  font-size: 1.3em;
}

button {
  background-color: #0091ea;
  height: 2.5em;
  width: 12em;
  border: 0px;
  color: black;
  font-family: barlow-medium;
  font-size: 1.25em;
  box-shadow: .25em .25em #0091ea55;
}

button:hover {
  background-color: #E8F2FF;
  transition-duration: 300ms;
}
</style>