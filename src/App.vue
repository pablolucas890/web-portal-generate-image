<script>
import Container from './components/Container.vue'
import Input from './components/Input.vue';
import Select from './components/Select.vue';
import DataTable from './components/DataTable.vue';
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
      image_bases: ['RaspberryPI-02-03-2022', 'OrangePI-08-09-2021'], // Localizar da pasta
      selected_image_base: '',
      imageName: '',
      db3File: null,
      ovpnFile: null,
      Appdb3File: null,
      searchQuery: '',
      gridColumns: ['nome', 'data', 'status', 'placa', 'versao'],
      gridData: [ //localizar da pasta
        { nome: 'OrangePI_Cliente_Lucas', data: '31/05/2022', status: 'loading', placa: 'OrangePI', versao: '4-5-33' },
        { nome: 'RaspberryPI_Cliente_Lucas', data: '03/05/2022', status: 'download', placa: 'RaspberryPI', versao: '4-5-33' },
        { nome: 'Teste', data: '04/05/2022', status: 'download', placa: 'RaspberryPI', versao: '4-5-33' },
        { nome: 'Carlos', data: '31/07/2022', status: 'download', placa: 'RaspberryPI', versao: '1-2-33' }
      ]
    }
  },
  methods: {
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
      console.log('teste')
      // async function listarArquivosDoDiretorio(diretorio, arquivos) {

      //   if (!arquivos)
      //     arquivos = [];

      //   let listaDeArquivos = await fs.readdir(diretorio);
      //   for (let k in listaDeArquivos) {
      //     let stat = await fs.stat(diretorio + '/' + listaDeArquivos[k]);
      //     if (stat.isDirectory())
      //       await listarArquivosDoDiretorio(diretorio + '/' + listaDeArquivos[k], arquivos);
      //     else
      //       arquivos.push(diretorio + '/' + listaDeArquivos[k]);
      //   }

      //   return arquivos;

      // }
      // let arquivos = await listarArquivosDoDiretorio('./'); // coloque o caminho do seu diretorio
      // console.log(arquivos);
      if (this.preenchido) {

        //Gerar Imagem Concatenando as strings

      } else {
        // Aplicar animacao no componete
        if (this.$refs.alert.className.includes('2')) {
          this.$refs.alert.className = 'visible visible-transform'
        } else {
          this.$refs.alert.className = 'visible visible-transform2'
        }
      }
    },
  }
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
          <img src="./assets/logo.png" width="200" class="float-right" alt="Controllar">
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <Select @click="this.todosPreenchidos" @change="this.todosPreenchidos()" title="Selecione uma Imagem Base: "
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