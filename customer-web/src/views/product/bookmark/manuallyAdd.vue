<template>
    <div class="manually-add" v-loading="loadingPage">
        <div class="title">
            {{$i.product.basicInformation}}
        </div>
        <el-form class="speForm" label-width="290px" :label-position="labelPosition">
            <el-row>
                <el-col cass="speCol" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="Pic:">
                        <v-upload :list="productForm.pictures" :onlyImage="true" :limit="20" ref="upload"></v-upload>
                    </el-form-item>
                </el-col>
                <el-col
                        class="speCol"
                        v-for="v in $db.product.detailTab"
                        v-if="v.belongTab==='basicInfo' && !v.isHide"
                        :key="v.key"
                        :xs="24"
                        :sm="v.fullLine?24:12"
                        :md="v.fullLine?24:12"
                        :lg="v.fullLine?24:12"
                        :xl="v.fullLine?24:12">
                    <el-form-item :required="v._rules?v._rules.required:false" :label="v.label+':'">
                        <div v-if="v.showType==='input'">
                            <el-input
                                    class="speInput"
                                    v-model="productForm[v.key]"
                                    :placeholder="$i.product.pleaseInput"></el-input>
                        </div>
                        <div v-else-if="v.showType==='select'">
                            <div v-if="v.isCurrency">
                                <el-select class="speInput" size="mini" v-model="productForm.price[0][v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in currencyOption"
                                            :key="item.id"
                                            :label="item.code"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isCountry">
                                <el-select class="speInput" size="mini" v-model="productForm[v.key]" multiple filterable collapse-tags :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in countryOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isSkuUnit">
                                <el-select class="speInput" size="mini" v-model="productForm[v.key]" filterable :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in skuUnitOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isReadilyAvailable">
                                <el-select
                                        class="speInput"
                                        v-model="productForm[v.key]"
                                        filterable
                                        clearable
                                        :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in availableOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isDateUnit">
                                <el-select class="speInput" size="mini" v-model="productForm[v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in dateOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isWeightUnit">
                                <el-select class="speInput" size="mini" v-model="productForm[v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in weightOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isVolumeUnit">
                                <el-select class="speInput" size="mini" v-model="productForm[v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in volumeOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isLengthUnit">
                                <el-select class="speInput" size="mini" v-model="productForm[v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in lengthOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isSaleStatus">
                                <el-select class="speInput" size="mini" v-model="productForm[v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in saleStatus"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isFormation">
                                <el-select
                                        class="speInput"
                                        clearable
                                        v-model="productForm[v.key]"
                                        :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in formationOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else>
                                <el-select class="speInput" size="mini" v-model="productForm[v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in v.options"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div v-else-if="v.showType==='textarea'">
                            <el-input
                                    class="speInput"
                                    type="textarea"
                                    :autosize="{minRows: 2}"
                                    :placeholder="$i.product.pleaseInput"
                                    v-model="productForm[v.key]">
                            </el-input>
                        </div>
                        <div v-else-if="v.showType==='number'">
                            <v-input-number
                                    class="speInput speNumber"
                                    size="mini"
                                    v-model="productForm[v.key]"
                                    :mark="v.label"
                                    :placeholder="$i.product.pleaseInput"
                                    :accuracy="v.accuracy"></v-input-number>
                        </div>
                        <div v-else-if="v.showType==='dropdown'">
                            <drop-down
                                    class="speInput"
                                    :list="categoryList"
                                    :defaultProps="defaultProps"
                                    v-model="productForm[v.key]"
                                    :searchPlaceholder="$i.product.pleaseInput"
                                    ref="dropDown"></drop-down>
                        </div>
                        <div v-else-if="v.showType==='attachment'">
                            <v-upload
                                    :list="productForm[v.key]"
                                    :limit="20"
                                    :ref="v.key"></v-upload>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <div class="title">
            {{$i.product.customerInfo}}
        </div>
        <el-form :modal="productForm" ref="customerInfo" class="speForm" label-width="290px" :label-position="labelPosition">
            <el-row>
                <el-col class="speCol" v-for="v in $db.product.detailTab" v-if="v.belongTab==='customerInfo'" :key="v.key" :xs="24" :sm="v.fullLine?24:12" :md="v.fullLine?24:12" :lg="v.fullLine?24:12" :xl="v.fullLine?24:12">
                    <el-form-item :prop="v.key" :label="v.label+':'">
                        <div v-if="v.showType==='input'">
                            <el-input class="speInput" size="mini" v-model="productForm[v.key]" :placeholder="$i.product.pleaseInput"></el-input>
                        </div>
                        <div v-else-if="v.showType==='select'">
                            <div v-if="v.isInspectQuarantineCategory">
                                <el-select
                                        class="speInput"
                                        v-model="productForm[v.key]"
                                        :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in quarantineTypeOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div v-else-if="v.showType==='textarea'">
                            <el-input
                                    class="speInput"
                                    type="textarea"
                                    :autosize="{minRows: 2}"
                                    :placeholder="$i.product.pleaseInput"
                                    v-model="productForm[v.key]">
                            </el-input>
                        </div>
                        <div v-else-if="v.showType==='number'">
                            <v-input-number
                                    class="speInput speNumber"
                                    size="mini"
                                    v-model="productForm[v.key]"
                                    :controls="false"
                                    :min="0"
                                    :placeholder="$i.product.pleaseInput"
                                    :mark="v.label"
                                    :accuracy="v.accuracy"
                                    label="please input"></v-input-number>
                        </div>
                        <div v-else-if="v.showType==='dropdown'">
                            <drop-down
                                    class="speInput"
                                    :list="dropData"
                                    ref="dropDown"></drop-down>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <div class="title">
            {{$i.product.priceInfo}}
        </div>
        <el-form :modal="productForm" ref="priceInfo" class="speForm" label-width="290px" :label-position="labelPosition">
            <el-row>
                <el-col class="speCol" v-for="v in $db.product.detailTab" v-if="v.belongTab==='priceInfo'" :key="v.key" :xs="24" :sm="v.fullLine?24:12" :md="v.fullLine?24:12" :lg="v.fullLine?24:12" :xl="v.fullLine?24:12">
                    <el-form-item :prop="v.key" :label="v.label+':'">
                        <div v-if="v.showType==='input'">
                            <el-input class="speInput" size="mini" v-model="productForm.price[0][v.key]" :placeholder="$i.product.pleaseInput"></el-input>
                        </div>
                        <div v-else-if="v.showType==='select'">
                            <div v-if="v.isCurrency">
                                <el-select class="speInput" size="mini" v-model="productForm.price[0][v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in currencyOption"
                                            :key="item.id"
                                            :label="item.code"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isCountry">
                                <el-select class="speInput" size="mini" v-model="productForm.price[0][v.key]" filterable :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in countryOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isDateUnit">
                                <el-select class="speInput" size="mini" v-model="productForm.price[0][v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in dateOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isWeightUnit">
                                <el-select class="speInput" size="mini" v-model="productForm.price[0][v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in weightOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isVolumeUnit">
                                <el-select class="speInput" size="mini" v-model="productForm.price[0][v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in volumeOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isLengthUnit">
                                <el-select class="speInput" size="mini" v-model="productForm.price[0][v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in lengthOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else>
                                <el-select class="speInput" size="mini" v-model="productForm.price[0][v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in v.options"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div v-else-if="v.showType==='textarea'">
                            <el-input
                                    class="speInput"
                                    type="textarea"
                                    autosize
                                    :placeholder="$i.product.pleaseInput"
                                    v-model="productForm.price[0][v.key]">
                            </el-input>
                        </div>
                        <div v-else-if="v.showType==='number'">
                            <v-input-number
                                    class="speInput speNumber"
                                    size="mini"
                                    v-model="productForm.price[0][v.key]"
                                    :controls="false"
                                    :min="0"
                                    :placeholder="$i.product.pleaseInput"
                                    :mark="v.label"
                                    :accuracy="v.accuracy"
                                    label="please input"></v-input-number>
                        </div>
                        <div v-else-if="v.showType==='dropdown'">
                            <drop-down
                                    class="speInput"
                                    :list="dropData"
                                    ref="dropDown"></drop-down>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <div class="title">
            {{$i.product.packingInfo}}
        </div>
        <el-form :modal="productForm" ref="packingInfo" class="speForm" label-width="300px" :label-position="labelPosition">
            <el-row>
                <el-col class="speCol" v-for="v in $db.product.detailTab" v-if="v.belongTab==='packingInfo'" :key="v.key" :xs="24" :sm="v.fullLine?24:12" :md="v.fullLine?24:12" :lg="v.fullLine?24:12" :xl="v.fullLine?24:12">
                    <el-form-item :prop="v.key" :label="v.label+':'">
                        <div v-if="v.showType==='input'">
                            <el-input class="speInput" size="mini" v-model="productForm[v.key]" :placeholder="$i.product.pleaseInput"></el-input>
                        </div>
                        <div v-else-if="v.showType==='select'">
                            <div v-if="v.isCurrency">
                                <el-select class="speInput" size="mini" v-model="productForm[v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in currencyOption"
                                            :key="item.id"
                                            :label="item.code"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isCountry">
                                <el-select class="speInput" size="mini" v-model="productForm[v.key]" filterable :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in countryOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isDateUnit">
                                <el-select class="speInput" size="mini" v-model="productForm[v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in dateOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isWeightUnit">
                                <el-select class="speInput" size="mini" v-model="productForm[v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in weightOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isVolumeUnit">
                                <el-select class="speInput" size="mini" v-model="productForm[v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in volumeOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isOem">
                                <el-select
                                        class="speInput"
                                        clearable
                                        v-model="productForm[v.key]"
                                        :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in oemOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isLengthUnit">
                                <el-select class="speInput" size="mini" v-model="productForm[v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in lengthOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else>
                                <el-select class="speInput" size="mini" v-model="productForm[v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in v.options"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div v-else-if="v.showType==='textarea'">
                            <el-input
                                    class="speInput"
                                    type="textarea"
                                    :autosize="{ minRows: 2}"
                                    :placeholder="$i.product.pleaseInput"
                                    v-model="productForm[v.key]">
                            </el-input>
                        </div>
                        <div v-else-if="v.showType==='number'">
                            <v-input-number
                                    class="speInput speNumber"
                                    v-model="productForm[v.key]"
                                    :min="0"
                                    :placeholder="$i.product.pleaseInput"
                                    :mark="v.label"
                                    :accuracy="v.accuracy"></v-input-number>
                        </div>
                        <div v-else-if="v.showType==='dropdown'">
                            <drop-down
                                    class="speInput"
                                    :list="dropData"
                                    ref="dropDown"></drop-down>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <div class="title">
            {{$i.product.logisticInfo}}
        </div>
        <el-form :modal="productForm" ref="logisticInfo" class="speForm" label-width="300px" :label-position="labelPosition">
            <el-row>
                <el-col class="speCol" v-for="v in $db.product.detailTab" v-if="v.belongTab==='logisticInfo'" :key="v.key" :xs="24" :sm="v.fullLine?24:12" :md="v.fullLine?24:12" :lg="v.fullLine?24:12" :xl="v.fullLine?24:12">
                    <el-form-item :prop="v.key" :label="v.label+':'">
                        <div v-if="v.showType==='input'">
                            <el-input class="speInput" size="mini" v-model="productForm[v.key]" :placeholder="$i.product.pleaseInput"></el-input>
                        </div>
                        <div v-else-if="v.showType==='select'">
                            <div v-if="v.isCurrency">
                                <el-select class="speInput" size="mini" v-model="productForm.price[0][v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in currencyOption"
                                            :key="item.id"
                                            :label="item.code"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isCountry">
                                <el-select class="speInput" size="mini" v-model="productForm.price[0][v.key]" filterable :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in countryOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isDateUnit">
                                <el-select class="speInput" size="mini" v-model="productForm.price[0][v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in dateOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isWeightUnit">
                                <el-select class="speInput" size="mini" v-model="productForm.price[0][v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in weightOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isVolumeUnit">
                                <el-select class="speInput" size="mini" v-model="productForm.price[0][v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in volumeOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isLengthUnit">
                                <el-select class="speInput" size="mini" v-model="productForm.price[0][v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in lengthOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else>
                                <el-select class="speInput" size="mini" v-model="productForm.price[0][v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in v.options"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div v-else-if="v.showType==='textarea'">
                            <el-input
                                    class="speInput"
                                    type="textarea"
                                    :autosize="{ minRows: 2}"
                                    :placeholder="$i.product.pleaseInput"
                                    v-model="productForm[v.key]">
                            </el-input>
                        </div>
                        <div v-else-if="v.showType==='number'">
                            <v-input-number
                                    class="speInput speNumber"
                                    size="mini"
                                    v-model="productForm[v.key]"
                                    :controls="false"
                                    :min="0"
                                    :placeholder="$i.product.pleaseInput"
                                    :mark="v.label"
                                    :accuracy="v.accuracy"
                                    label="please input"></v-input-number>
                        </div>
                        <div v-else-if="v.showType==='dropdown'">
                            <drop-down
                                    class="speInput"
                                    :list="dropData"
                                    ref="dropDown"></drop-down>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <div class="title">
            {{$i.product.otherInfo}}
        </div>
        <el-form :modal="productForm" ref="otherInfo" class="speForm" label-width="300px" :label-position="labelPosition">
            <el-row>
                <el-col class="speCol" v-for="v in $db.product.detailTab" v-if="v.belongTab==='otherInfo'" :key="v.key" :xs="24" :sm="v.fullLine?24:12" :md="v.fullLine?24:12" :lg="v.fullLine?24:12" :xl="v.fullLine?24:12">
                    <el-form-item :prop="v.key" :label="v.label+':'">
                        <div v-if="v.showType==='input'">
                            <el-input class="speInput" size="mini" v-model="productForm[v.key]" :placeholder="$i.product.pleaseInput"></el-input>
                        </div>
                        <div v-else-if="v.showType==='select'">
                            <div v-if="v.isCurrency">
                                <el-select class="speInput" size="mini" v-model="productForm[v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in currencyOption"
                                            :key="item.id"
                                            :label="item.code"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isCountry">
                                <el-select class="speInput" size="mini" v-model="productForm[v.key]" multiple collapse-tags filterable :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in countryOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isDateUnit">
                                <el-select class="speInput" size="mini" v-model="productForm[v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in dateOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isWeightUnit">
                                <el-select class="speInput" size="mini" v-model="productForm[v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in weightOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isVolumeUnit">
                                <el-select class="speInput" size="mini" v-model="productForm[v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in volumeOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isLengthUnit">
                                <el-select class="speInput" size="mini" v-model="productForm[v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in lengthOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isAdjustPackage">
                                <el-select
                                        class="speInput"
                                        clearable
                                        v-model="productForm[v.key]"
                                        :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in packageAdjustOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="v.isUseDisplayBox">
                                <el-select
                                        class="speInput"
                                        clearable
                                        v-model="productForm[v.key]"
                                        :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in showDisplayBoxOption"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else>
                                <el-select class="speInput" size="mini" v-model="productForm[v.key]" :placeholder="$i.product.pleaseChoose">
                                    <el-option
                                            v-for="item in v.options"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div v-else-if="v.showType==='textarea'">
                            <el-input
                                    class="speInput"
                                    type="textarea"
                                    autosize
                                    :placeholder="$i.product.pleaseInput"
                                    v-model="productForm[v.key]">
                            </el-input>
                        </div>
                        <div v-else-if="v.showType==='number'">
                            <div v-if="v.key==='lengthWidthHeight'">
                                <v-input-number
                                        class="speNum"
                                        size="mini"
                                        v-model="boxSize.length"
                                        :accuracy="2"
                                        :min="0">
                                </v-input-number>
                                <div class="speIcon">*</div>
                                <v-input-number
                                        class="speNum"
                                        size="mini"
                                        :accuracy="2"
                                        v-model="boxSize.width"
                                        :min="0">
                                </v-input-number>
                                <div class="speIcon">*</div>
                                <v-input-number
                                        class="speNum"
                                        size="mini"
                                        :accuracy="2"
                                        v-model="boxSize.height"
                                        :min="0">
                                </v-input-number>
                            </div>
                            <div v-else>
                                <v-input-number
                                        class="speInput speNumber"
                                        size="mini"
                                        v-model="productForm[v.key]"
                                        :controls="false"
                                        :min="0"
                                        :placeholder="$i.product.pleaseInput"
                                        :mark="v.label"
                                        :accuracy="v.accuracy"></v-input-number>
                            </div>
                        </div>
                        <div v-else-if="v.showType==='dropdown'">
                            <drop-down
                                    class="speInput"
                                    :list="dropData"
                                    ref="dropDown"></drop-down>
                        </div>
                        <div v-else-if="v.showType==='date'">
                            <el-date-picker
                                    class="speInput"
                                    v-model="productForm[v.key]"
                                    align="right"
                                    type="month"
                                    :editable="false"
                                    :placeholder="$i.product.pleaseChoose">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <div class="title">
            {{$i.product.attachment}}
        </div>
        <div style="margin-bottom: 20px">
            <v-upload :limit="20" :list="productForm.attachments" ref="uploadAttachmemt"></v-upload>
        </div>

        <div class="footBtn">
            <el-button @click="finish" :loading="disabledSubmit" type="primary">{{$i.product.finishEn}}</el-button>
        </div>
    </div>
</template>

<script>
    import {dropDownSingle,VUpload,VInputNumber} from '@/components/index'
    import {mapActions} from 'vuex'

    export default {
        name: "manually-add",
        components:{
            dropDown:dropDownSingle,
            VUpload,
            VInputNumber
        },
        data(){
            return{
                /**
                 * 页面基础配置
                 * */
                labelPosition:'left',
                imgGroup:[],
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                },
                disabledSubmit:false,
                defaultProps:{
                    label:'name',
                    children:'children'
                },
                loadingPage:false,
                //categoryID配置
                categoryList:[],
                boxSize:{
                    length:'',
                    width:'',
                    height:''
                },
                //整个页面数据配置
                productForm:{
                    attachments:[],
                    designs:[],                 //产品设计
                    notes:[],                   //产品说明书
                    adjustPackage: '1',
                    barcode: "",
                    brand: "",
                    brandRelated: "",
                    brandRemark: "",
                    categoryId: 0,
                    certificat: "",
                    code: "",
                    colourEn: "",
                    comments: "",
                    commodityInspectionEn: "",
                    customerCreate: true,
                    customerSkuCode: "",
                    customsCode: "",
                    customsNameEn: "",
                    // deliveryDates: 0,
                    descCustomer: "",
                    descEn: "",
                    design: "",
                    expireUnit: '3',
                    formation: "",
                    id: null,
                    visibility:true,
                    innerCartonDesc: "",
                    innerCartonMethodEn: "",
                    innerCartonUnit: "",
                    inventoryCostMethod: "",
                    lengthWidthHeight: "",
                    logisticId: null,
                    mainSaleArea: "",
                    mainSaleCountry: '',
                    materialEn: "",
                    methodPkgEn: "",
                    nameCustomer: "",
                    nameEn: "",
                    noneSellCountry: '',
                    oem: '1',
                    origin: "",
                    otherPackInfoEn: "",
                    outerCartonDesc: "",
                    outerCartonMethodEn: "",
                    outerCartonUnit: "",
                    pictures: [],
                    pkgId: null,
                    price: [
                        {
                            //新增的
                            cifArea: "",
                            cifCurrency: 'USD',
                            dduArea: "",
                            dduCurrency: 'USD',
                            //旧的
                            exwCurrency: 'USD',
                            fobCurrency: 'USD',
                            fobPort: "",
                            status: 2,          //1:基础报价，2:成本价
                        }
                    ],
                    qualityStander: "",
                    readilyAvailable: '1',
                    recycle: false,
                    specialTransportRequire: "",
                    status: '1',
                    // supplierCode: "",
                    // supplierId: null,
                    // supplierName: "",
                    tradeMarkEn: "",
                    unit: '1',
                    unitLength: '5',
                    unitVolume: '3',
                    unitWeight: '7',
                    useDisplayBox: '1',
                    yearListed: ""
                },
                /**
                 * 页面字典
                 * */
                currencyOption:[],
                countryOption:[],
                dateOption:[],      //时间单位，年月日
                weightOption:[],    //重量单位
                volumeOption:[],    //体积单位
                lengthOption:[],    //长度单位
                saleStatus:[],      //销售状态，上下架
                skuUnitOption:[],   //计量单位
                availableOption:[], //有无货
                oemOption:[],       //是否可以贴牌
                showDisplayBoxOption:[],    //是否展示包装盒
                packageAdjustOption:[],     //产品包装调整
                quarantineTypeOption:[],    //检疫类别
                formationOption:[],         //产品组成

            }
        },
        methods:{
            ...mapActions(['setMenuLink']),
            //完成新增
            finish(){
                if(this.$validateForm(this.productForm, this.$db.product.detailTab)){
                    return;
                }
                let params=Object.assign({},this.productForm);
                params.pictures=this.$refs.upload.getFiles();
                params.attachments=this.$refs.uploadAttachmemt.getFiles();
                params.designs=this.$refs.designs[0].getFiles();
                params.notes=this.$refs.notes[0].getFiles();
                // return console.log(this.$depthClone(params),'params')
                let key=['status','unit','readilyAvailable','expireUnit','unitWeight','unitLength','unitVolume','oem','useDisplayBox','adjustPackage']
                _.map(key,v=>{
                    params[v]=Number(params[v]);
                });
                let tureFalseKey=['readilyAvailable','oem','useDisplayBox','adjustPackage'];
                _.map(tureFalseKey,v=>{
                    params[v]=(params[v]?true:false);
                });
                let noneSellCountry='',mainSaleCountry='';
                params.noneSellCountry.forEach(v=>{
                    noneSellCountry+=(v+',');
                });
                params.mainSaleCountry.forEach(v=>{
                    mainSaleCountry+=(v+',');
                });
                noneSellCountry=noneSellCountry.slice(0,noneSellCountry.length-1);
                mainSaleCountry=mainSaleCountry.slice(0,mainSaleCountry.length-1);
                params.noneSellCountry=noneSellCountry;
                params.mainSaleCountry=mainSaleCountry;
                let size=this.boxSize.length+'*'+this.boxSize.width+'*'+this.boxSize.height;
                params.lengthWidthHeight=size;
                params.visibility=true;
                this.disabledSubmit=true;
                this.$ajax.post(this.$apis.add_customerSku,params).then(res=>{
                    this.$router.push({
                        path:'/product/bookmarkDetail',
                        query:{
                            id:res.skuId,
                            bookmarkId:res.bookmarkId
                        }
                    });
                }).finally(err=>{
                    this.disabledSubmit=false;
                });
            },

            /**
             * 获取字典data
             * */
            getUnitCode(){
                const currencyAjax=this.$ajax.get(this.$apis.get_currencyUnit,{},{cache:true});
                const countryAjax=this.$ajax.get(this.$apis.get_country,{},{cache:true});
                const partUnit=this.$ajax.post(this.$apis.get_partUnit,['SKU_SALE_STATUS','SKU_READILY_AVAIALBLE','ED_UNIT','WT_UNIT','VE_UNIT','LH_UNIT','SKU_UNIT','OEM_IS','UDB_IS','SKU_PG_IS','QUARANTINE_TYPE','SKU_FORMATION'],{cache:true});
                const sysCategory=this.$ajax.get(this.$apis.get_buyer_sys_category,{});
                const myCategory=this.$ajax.get(this.$apis.get_buyer_my_category,{});
                this.loadingPage=true;
                this.$ajax.all([currencyAjax,countryAjax,partUnit,sysCategory,myCategory]).then(res=>{
                    this.currencyOption=res[0];
                    this.countryOption=res[1];
                    res[2].forEach(v=>{
                        if(v.code==='ED_UNIT'){
                            this.dateOption=v.codes;
                        }else if(v.code==='WT_UNIT'){
                            this.weightOption=v.codes;
                        }else if(v.code==='VE_UNIT'){
                            this.volumeOption=v.codes;
                        }else if(v.code==='LH_UNIT'){
                            this.lengthOption=v.codes;
                        }else if(v.code==='SKU_SALE_STATUS'){
                            this.saleStatus=v.codes;
                        }else if(v.code==='SKU_UNIT'){
                            this.skuUnitOption=v.codes;
                        }else if(v.code==='SKU_READILY_AVAIALBLE'){
                            this.availableOption=v.codes;
                        }else if(v.code==='OEM_IS'){
                            this.oemOption=v.codes;
                        }else if(v.code==='UDB_IS'){
                            this.showDisplayBoxOption=v.codes;
                        }else if(v.code==='SKU_PG_IS'){
                            this.packageAdjustOption=v.codes;
                        }else if (v.code === "QUARANTINE_TYPE") {
                            this.quarantineTypeOption = v.codes;
                        } else if (v.code === "SKU_FORMATION") {
                            this.formationOption = v.codes;
                        }
                    });
                    let categoryList=[
                        {
                            id:512512,
                            name:this.$i.product.myCategory,
                            children:[]
                        },
                        {
                            id:123153315,
                            name:this.$i.product.sysCategory,
                            children:[]
                        },
                    ];
                    categoryList[1].children=res[3];
                    categoryList[0].children=res[4];
                    this.categoryList=categoryList;
                }).finally(()=>{
                    this.loadingPage=false;
                });
            },
        },
        created(){
            if(this.$route.query.id){
                this.loadingPage=true;
                this.$ajax.get(this.$apis.get_buyerProductDetail,{
                    id:this.$route.query.id
                }).then(res=>{
                    this.loadingPage=false;

                    let tureFalseKey=['readilyAvailable','oem','useDisplayBox','adjustPackage'];
                    _.map(tureFalseKey,v=>{
                        res[v]=res[v]?1:0;
                    });

                    let key=['status','unit','readilyAvailable','expireUnit','unitWeight','unitLength','unitVolume','oem','useDisplayBox','adjustPackage']
                    _.map(key,v=>{
                        res[v]=String(res[v]);
                    });
                    res.noneSellCountry=res.noneSellCountry?res.noneSellCountry.split(','):[];
                    res.mainSaleCountry=res.mainSaleCountry?res.mainSaleCountry.split(','):[];
                    res.price=[];
                    res.price.push({
                        cifArea: res.cifArea,
                        cifCurrency: res.cifCurrency,
                        cifPrice: res.cifPrice,
                        dduArea: res.dduArea,
                        dduCurrency: res.dduCurrency,
                        dduPrice: res.dduPrice,
                        refCifPrice: res.refCifPrice,
                        refDduPrice: res.refDduPrice,
                        refFobPrice: res.refFobPrice,
                        //旧的
                        exwCurrency: res.exwCurrency,
                        exwPrice: res.exwPrice,
                        fobCurrency: res.fobCurrency,
                        fobPort: res.fobPort,
                        fobPrice: res.fobPrice,
                        id: res.priceId,
                        status: 2,          //1:基础报价，2:成本价
                    });
                    this.boxSize.length=Number(res.lengthWidthHeight.split('*')[0]);
                    this.boxSize.width=Number(res.lengthWidthHeight.split('*')[1]);
                    this.boxSize.height=Number(res.lengthWidthHeight.split('*')[2]);
                    this.productForm=res;
                    this.getUnitCode();
                }).catch(err=>{
                    this.loadingPage=false;
                })
            }
            else{
                this.getUnitCode();
            }
        },
        mounted(){
            this.setMenuLink({
                path: '/logs/index',
                query: {code: 'PRODUCT'},
                type: 10,
                auth:'PRODUCT:LOG',
                label: this.$i.common.log
            });
        },
    }
</script>

<style scoped>
    .manually-add{
        position: relative;
    }
    .title{
        font-weight: bold;
        font-size: 18px;
        height: 32px;
        line-height: 32px;
        color:#666666;
    }

    .addPic{
        height: 50px;
        line-height: 50px;
    }
    .addPic>div{
        float: left;
        height: 50px;
        line-height: 50px;
    }
    .addPic .imgGroup{
        margin-left: 10px;
    }
    .addPic .btns{
        margin-left: 20px;
    }

    .speForm .el-form-item--small.el-form-item{
        /*margin-bottom: 0;*/
    }
    .speForm .el-row .list .el-input{
        width: 80%;
    }
    .speCol{
        min-height: 51px;
    }
    .speInput{
        width: 80%;
    }
    .speNumber >>> input{
        text-align: left;
    }
    .speNum{
        width: 60px;
    }
    .speIcon{
        display: inline-block;
        height: 28px;
        line-height: 28px;
    }
    .footBtn{
        border-top: 1px solid #e0e0e0;
        height: 40px;
        line-height: 40px;
        background-color: #ffffff;
        position: sticky;
        left: 0;
        bottom: 0;
        width: 100%;
        text-align: left;
    }
</style>
