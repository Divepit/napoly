<template>
  <div class="about">
    <v-content>
      <v-container style="position: fixed; z-index: 100; left: 2%">
        <v-row>
          <v-col>
            <v-card width="200" class="pa-2 white--text" to="/" color="primary">
              <v-icon class="mr-2" color="white">mdi-arrow-left</v-icon>
              Back to Homepage
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <div>
        <v-container style="height: 20vh; width: 100vw" class="fill-height">
          <v-row>
            <v-col cols="12" class="text-center font-weight-light primary--text pb-0" style="font-size: 3rem">
              napoly.ch
            </v-col><v-col cols="12" class="text-center font-weight-light primary--text pt-0" style="font-size: 1.25rem; font-family: Open Sans">
            Student Document Repository
          </v-col>
          </v-row>
        </v-container>
      </div>
      <v-container>
        <v-row justify="center" class="text-center">
          <v-col cols="12" class="pb-0">
            <v-row justify="center">
              <v-card width="200" class="pa-2 grey--text" flat>
                <v-card-text class="title font-weight-light grey--text pb-0">Organisation</v-card-text>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-card-title class="primary--text font-weight-light">Marco Trentini
                <v-spacer/><a href="mailto:marcotr@ethz.ch"><v-icon color="primary">mdi-mail</v-icon></a>
              </v-card-title>
              <v-card-text>- Frontend & Backend Code<br> - Serveradministration <br> - Mitgliederadministration</v-card-text>
            </v-card>
          </v-col>
          <v-col>
            <v-card>
              <v-card-title class="primary--text font-weight-light">Micha Bosshart
                <v-spacer/><a href="mailto:bmicha@ethz.ch"><v-icon color="primary">mdi-mail</v-icon></a>
              </v-card-title>
              <v-card-text>- Mitgliederadministration <br> - Kommunikation <br> <br> </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-divider class="mt-10"/>
<!--        D-MAVT-->
        <v-row justify="center" class="text-center">
          <v-col cols="12" class="pb-0">
            <v-row justify="center">
              <v-card width="200" class="pa-2 grey--text" flat>
                <v-card-text class="title font-weight-light grey--text pb-0">D-MAVT</v-card-text>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="mx-2">
            <v-row justify="center" class="text-center">
              <v-col cols="12">
                <v-row justify="center">
                  <v-card width="200" class="pa-2 grey--text" flat>
                    <v-card-text class="title font-weight-light grey--text py-0">1. Jahr</v-card-text>
                  </v-card>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-card style="width: 100%" class="text-center mb-4">
                <v-card-title class="primary--text font-weight-light pb-0"><v-spacer/>Siddhartha Lakkakula<v-spacer/></v-card-title>
                <v-card-text>- Semesterverantwortlicher</v-card-text>
              </v-card>
            </v-row>
            <v-row>
              <v-card style="width: 100%" class="text-center mb-4">
                <v-card-title class="primary--text font-weight-light"><v-spacer/>Aline Usinger<v-spacer/></v-card-title>
              </v-card>
            </v-row>
            <v-row>
              <v-card style="width: 100%" class="text-center mb-4">
                <v-card-title class="primary--text font-weight-light"><v-spacer/>Jan Sigrist<v-spacer/></v-card-title>
              </v-card>
            </v-row><v-row>
              <v-card style="width: 100%" class="text-center mb-4">
                <v-card-title class="primary--text font-weight-light"><v-spacer/>Julian Weber<v-spacer/></v-card-title>
              </v-card>
            </v-row>
          </v-col>
          <v-col class="mx-2">
            <v-row justify="center" class="text-center">
              <v-col cols="12">
                <v-row justify="center">
                  <v-card width="200" class="pa-2 grey--text" flat>
                    <v-card-text class="title font-weight-light grey--text py-0">2. Jahr</v-card-text>
                  </v-card>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-card style="width: 100%" class="text-center mb-4">
                <v-card-title class="primary--text font-weight-light pb-0"><v-spacer/>Felix Tobler<v-spacer/></v-card-title>
                <v-card-text>- Semesterverantwortlicher</v-card-text>
              </v-card>
            </v-row>
            <v-row>
              <v-card style="width: 100%" class="text-center mb-4">
                <v-card-title class="primary--text font-weight-light"><v-spacer/>Rosina Weiss<v-spacer/></v-card-title>
              </v-card>
            </v-row>
          </v-col>
          <v-col class="mx-2">
            <v-row justify="center" class="text-center">
              <v-col cols="12">
                <v-row justify="center">
                  <v-card width="200" class="pa-2 grey--text" flat>
                    <v-card-text class="title font-weight-light grey--text py-0">3. Jahr</v-card-text>
                  </v-card>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-card style="width: 100%" class="text-center mb-4">
                <v-card-title class="primary--text font-weight-light pb-0"><v-spacer/>Micha Bosshart<v-spacer/></v-card-title>
                <v-card-text>- Semesterverantwortlicher</v-card-text>
              </v-card>
            </v-row>
            <v-row>
              <v-card style="width: 100%" class="text-center mb-4">
                <v-card-title class="primary--text font-weight-light"><v-spacer/>Marco Trentini<v-spacer/></v-card-title>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
        <v-divider/>
<!--        D-ITET-->
        <v-row justify="center" class="text-center">
          <v-col cols="12" class="pb-0">
            <v-row justify="center">
              <v-card width="200" class="pa-2 grey--text" flat>
                <v-card-text class="title font-weight-light grey--text pb-0">D-ITET</v-card-text>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="mx-2">
            <v-row justify="center" class="text-center">
              <v-col cols="12">
                <v-row justify="center">
                  <v-card width="200" class="pa-2 grey--text" flat>
                    <v-card-text class="title font-weight-light grey--text py-0">1. Jahr</v-card-text>
                  </v-card>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="mx-2">
            <v-row justify="center" class="text-center">
              <v-col cols="12">
                <v-row justify="center">
                  <v-card width="200" class="pa-2 grey--text" flat>
                    <v-card-text class="title font-weight-light grey--text py-0">2. Jahr</v-card-text>
                  </v-card>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-card style="width: 100%" class="text-center mb-4">
                <v-card-title class="primary--text font-weight-light pb-0"><v-spacer/>Basil Wymann<v-spacer/></v-card-title>
                <v-card-text>- Semesterverantwortlicher</v-card-text>
              </v-card>
            </v-row>
          </v-col>
          <v-col class="mx-2">
            <v-row justify="center" class="text-center">
              <v-col cols="12">
                <v-row justify="center">
                  <v-card width="200" class="pa-2 grey--text" flat>
                    <v-card-text class="title font-weight-light grey--text py-0">3. Jahr</v-card-text>
                  </v-card>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider/>
<!--        D-BAUG-->
        <v-row justify="center" class="text-center">
          <v-col cols="12" class="pb-0">
            <v-row justify="center">
              <v-card width="200" class="pa-2 grey--text" flat>
                <v-card-text class="title font-weight-light grey--text pb-0">D-BAUG</v-card-text>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="mx-2">
            <v-row justify="center" class="text-center">
              <v-col cols="12">
                <v-row justify="center">
                  <v-card width="200" class="pa-2 grey--text" flat>
                    <v-card-text class="title font-weight-light grey--text py-0">1. Jahr</v-card-text>
                  </v-card>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="mx-2">
            <v-row justify="center" class="text-center">
              <v-col cols="12">
                <v-row justify="center">
                  <v-card width="200" class="pa-2 grey--text" flat>
                    <v-card-text class="title font-weight-light grey--text py-0">2. Jahr</v-card-text>
                  </v-card>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-card style="width: 100%" class="text-center mb-4">
                <v-card-title class="primary--text font-weight-light pb-0"><v-spacer/>Jonathan Wilp<v-spacer/></v-card-title>
                <v-card-text>- Semesterverantwortlicher</v-card-text>
              </v-card>
            </v-row>
          </v-col>
          <v-col class="mx-2">
            <v-row justify="center" class="text-center">
              <v-col cols="12">
                <v-row justify="center">
                  <v-card width="200" class="pa-2 grey--text" flat>
                    <v-card-text class="title font-weight-light grey--text py-0">3. Jahr</v-card-text>
                  </v-card>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-card style="width: 100%" class="text-center mb-4">
                <v-card-title class="primary--text font-weight-light pb-0"><v-spacer/>Altin Suli<v-spacer/></v-card-title>
                <v-card-text>- Semesterverantwortlicher</v-card-text>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
        <v-divider/>
<!--        D-ARCH-->
        <v-row justify="center" class="text-center">
          <v-col cols="12" class="pb-0">
            <v-row justify="center">
              <v-card width="200" class="pa-2 grey--text" flat>
                <v-card-text class="title font-weight-light grey--text pb-0">D-ARCH</v-card-text>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="mx-2">
            <v-row justify="center" class="text-center">
              <v-col cols="12">
                <v-row justify="center">
                  <v-card width="200" class="pa-2 grey--text" flat>
                    <v-card-text class="title font-weight-light grey--text py-0">1. Jahr</v-card-text>
                  </v-card>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="mx-2">
            <v-row justify="center" class="text-center">
              <v-col cols="12">
                <v-row justify="center">
                  <v-card width="200" class="pa-2 grey--text" flat>
                    <v-card-text class="title font-weight-light grey--text py-0">2. Jahr</v-card-text>
                  </v-card>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-card style="width: 100%" class="text-center mb-4">
                <v-card-title class="primary--text font-weight-light pb-0"><v-spacer/>Manuel Eichenberger<v-spacer/></v-card-title>
                <v-card-text>- Semesterverantwortlicher</v-card-text>
              </v-card>
            </v-row>
          </v-col>
          <v-col class="mx-2">
            <v-row justify="center" class="text-center">
              <v-col cols="12">
                <v-row justify="center">
                  <v-card width="200" class="pa-2 grey--text" flat>
                    <v-card-text class="title font-weight-light grey--text py-0">3. Jahr</v-card-text>
                  </v-card>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider/>
<!--        D-BIOL-->
        <v-row justify="center" class="text-center">
          <v-col cols="12" class="pb-0">
            <v-row justify="center">
              <v-card width="200" class="pa-2 grey--text" flat>
                <v-card-text class="title font-weight-light grey--text pb-0">D-BIOL</v-card-text>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="mx-2">
            <v-row justify="center" class="text-center">
              <v-col cols="12">
                <v-row justify="center">
                  <v-card width="200" class="pa-2 grey--text" flat>
                    <v-card-text class="title font-weight-light grey--text py-0">1. Jahr</v-card-text>
                  </v-card>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="mx-2">
            <v-row justify="center" class="text-center">
              <v-col cols="12">
                <v-row justify="center">
                  <v-card width="200" class="pa-2 grey--text" flat>
                    <v-card-text class="title font-weight-light grey--text py-0">2. Jahr</v-card-text>
                  </v-card>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-card style="width: 100%" class="text-center mb-4">
                <v-card-title class="primary--text font-weight-light pb-0"><v-spacer/>Elina Jansone<v-spacer/></v-card-title>
                <v-card-text>- Semesterverantwortliche</v-card-text>
              </v-card>
            </v-row>
            <v-row>
              <v-card style="width: 100%" class="text-center mb-4">
                <v-card-title class="primary--text font-weight-light pb-0"><v-spacer/>Colin Scheurer<v-spacer/></v-card-title>
              </v-card>
            </v-row>
          </v-col>
          <v-col class="mx-2">
            <v-row justify="center" class="text-center">
              <v-col cols="12">
                <v-row justify="center">
                  <v-card width="200" class="pa-2 grey--text" flat>
                    <v-card-text class="title font-weight-light grey--text py-0">3. Jahr</v-card-text>
                  </v-card>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider class="mb-12 pb-12"/>

      </v-container>
    </v-content>
  </div>
</template>

<script>
export default {
  name: 'about',
  components: {
  }
}
</script>
