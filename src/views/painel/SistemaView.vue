<template>
  <div>
    <Drawer
      v-model:visible="visivel"
      header="Menu"
      :dismissable="true"
      :pt="{
        root: {
          class: 'position-relative',
        },
        mask: {
          // class: 'bg-transparent dark:bg-transparent p-events-none',
          //   style: 'pointer-events: none;',
        },
      }"
    >
      <template #container>
        <PanelMenu :model="panelMenuItems">
          <template #item="slotProps">
            <div class="p-menu-item-content">
              <a
                class="p-menu-item-link"
                style="padding: 0.7rem"
                :class="slotProps.item.customStyle ? 'flex-row-reverse' : 'flex-row'"
              >
                <i class="p-menu-item-icon" :class="slotProps.item.icon"></i>
                <small
                  class="p-menu-item-label"
                  :class="slotProps.item.customStyle ? 'flex-fill' : ''"
                  >{{ slotProps.item.label }}</small
                >
                <Avatar
                  v-if="slotProps.item.customStyle"
                  icon="pi pi-user"
                  class="mr-2"
                  size="normal"
                  shape="circle"
                />
              </a>
            </div>
          </template>
        </PanelMenu>
        <div style="overflow-y: scroll" class="flex-fill">
          <Menu :model="menuItems">
            <template #item="slotProps">
              <div class="p-menu-item-content rounded-0">
                <a class="p-menu-item-link" style="padding: 0.7rem">
                  <i class="p-menu-item-icon" :class="slotProps.item.icon"></i>
                  <small class="p-menu-item-label">{{ slotProps.item.label }}</small>
                </a>
              </div>
            </template>
          </Menu>
        </div>
      </template>
    </Drawer>
    <div>
      <Toolbar :pt="{ root: { class: 'border-0 border-bottom rounded-0 position-fixed w-100 top-0', style: 'z-index: 4;' } }">
        <template #start>
          <div class="d-flex align-items-center gap-3">
            <Button
              :icon="visivel ? 'pi pi-times' : 'pi pi-bars'"
              @click="visivel = !visivel"
              size="small"
            />
          </div>
        </template>

        <template #end>
          <div class="flex items-center gap-2">
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText placeholder="Buscar" size="small" />
            </IconField>
            <Button icon="pi pi-bell" text plain />
            <Button icon="pi pi-envelope" text plain />
          </div>
        </template>
      </Toolbar>
    </div>
  </div>
  <RouterView />
  <Footer />
</template>
<script lang="ts">
import { useRouter } from 'vue-router'
import { useAutenticacaoStore } from '@/stores/autenticacao.store'

export default {
  created() {
    this.construirMenuItems()
    this.construirPanelMenuItems()
  },

  data() {
    return {
      visivel: false,
      menuItems: [] as any[],
      panelMenuItems: [] as any[],
    }
  },

  methods: {
    construirMenuItems() {
      const router = useRouter()
      const rotas = router.options.routes.filter(
        (route) => route.meta?.secao && route.name !== 'login' && route.name !== 'registro'
      )

      this.menuItems = rotas.map((rota) => {
        if (rota.children && rota.children.length > 0) {
          return {
            label: rota.meta?.secao,
            items: rota.children.map((filho) => {
              const caminhoCompleto = filho.path.startsWith('/') 
                ? filho.path 
                : `${rota.path}/${filho.path}`
              
              return {
                label: this.formatarLabel(filho.name),
                command: () => {
                  this.$router.push(caminhoCompleto)
                  this.visivel = false
                },
                icon: filho.meta?.ico || 'pi pi-circle',
              }
            }),
          }
        } else {
          return {
            label: this.formatarLabel(rota.meta?.secao),
            command: () => {
              this.$router.push(rota.path)
              this.visivel = false
            },
            icon: rota.meta?.ico || 'pi pi-circle',
          }
        }
      })
    },

    construirPanelMenuItems() {
      const autenticacaoStore = useAutenticacaoStore()
      
      this.panelMenuItems = [
        {
          label: 'Usuário',
          icon: 'pi pi-angle-down',
          customStyle: true,
          items: [
            {
              label: 'Perfil',
              icon: 'pi pi-user',
              command: () => {
                this.$router.push('/perfil')
                this.visivel = false
              },
            },
            {
              label: 'Configurações',
              icon: 'pi pi-cog',
              command: () => {
                this.$router.push('/perfil/configuracoes')
                this.visivel = false
              },
            },
            {
              label: 'Suporte',
              icon: 'pi pi-question-circle',
              command: () => {
                this.$router.push('/perfil/suporte')
                this.visivel = false
              },
            },
            {
              label: 'Sair',
              icon: 'pi pi-sign-out',
              command: () => {
                autenticacaoStore.token = null
                sessionStorage.removeItem('token')
                this.$router.push('/')
              },
            },
          ],
        },
      ]
    },

    formatarLabel(nome: any) {
      if (!nome) return ''
      return nome
        .toString()
        .charAt(0)
        .toUpperCase() + nome
        .toString()
        .slice(1)
        .replace(/-/g, ' ')
    },
  },
}
</script>
<style scoped>
/* .teste .p-overlay-mask-enter {
	animation: none !important;
} */

:deep(.p-panelmenu-submenu) {
  padding: 0;
}

:deep(.p-panelmenu-panel:last-child) {
  border-end-start-radius: 0px;
  border-end-end-radius: 0px;
}

:deep(.p-panelmenu-panel) {
  padding: 0;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  a {
    text-decoration: none;
  }
}

:deep(.p-menu) {
  border: none;
  padding: 0;

  .p-menu-list {
    padding: 0;
  }

  a {
    text-decoration: none;
  }
}

.transition-margin {
  transition: margin-left 0.3s ease;
}

.ml-60 {
  margin-left: 15rem;
}

:deep(.p-events-none) {
  pointer-events: none !important;
}
</style>
