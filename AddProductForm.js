import React, { useEffect, useMemo, useRef, useState } from 'react';
import CSelect from 'components/common/CSelect';
import InputBox from 'components/Input/InputBox';
import Button from 'components/Button/Button';
import { useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, Col, Form, Row } from 'reactstrap';
import { API } from 'utils/API/API';
import { toast } from 'react-toastify';
import ModalC from 'components/common/ModalC';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import Select from '@mui/material/Select';
import { ClipLoader } from 'react-spinners';
import { useHistory, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import '../stylesheets/comman/rowTable.scss';
import CTextarea from 'components/Textarea/CTextarea';
import '../assets/addproductform.scss'; 
// import CloseIcon from '../assets/img/closeicon.png';
import { SketchPicker } from 'react-color'
import CloseIcon from "../assets/img/closeicon.svg"
// import MultiSelect from 'components/MultiSelect/MultiSelect';
import MultiSelectBox from 'components/MultiSelect/MultiSelect';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import deleteIcon from '../assets/img/delete.png'
import CMultiSelect from 'components/common/CMultiSelect';
import { MultiSelect } from 'react-multi-select-component';
import MultiSelectManu from 'components/MultiSelect/multiSelectManufaturer';
import RichTextEditor from 'components/TextEditor/textEdiot';

const emptyImageObject = { fileName: '', code: '' ,modelName:'' ,id:'',color:''};

const AddProductForm = props => {

    const [fileError, setFileError] = useState('')
    const { product } = props;
    const [imageArray, setImageArray] = useState(
        [emptyImageObject])
    const { control, handleSubmit, register, setValue, getValues, watch, formState } = useForm({
        defaultValues: {
            activationType: product?.activationType || undefined,
            complies: product?.complies || undefined,
            name: product?.name || undefined,
            image: product?.image || undefined,
            country: product?.country || undefined,
            functionType: product?.functionType || undefined,
            group: product?.group || undefined,
            modelGroup: product?.modelGroup || undefined,
            operation: product?.operation || undefined,
            productGroup: product?.productGroup || undefined,
            productLine: product?.productLine || undefined,
            description: product?.description || undefined,
            productFiles: product?.productFiles || undefined,
            relatedProducts: product?.relatedProducts || undefined
        },
    });

    
    const location = useLocation();
    const [selectedProduct, setSelectedProduct] = useState([])
    const [loading, setLoading] = useState(true)
    const [manufactures, setManufactures] = useState([])
    const [curatedSelection, setCuratedSelection] = useState([])
    const [manufacturerChild, setManufacturesChild] = useState([])
    const [BuildingType, setBuildingType] = useState([])
    const [ScheduleType, setScheduleType] = useState([])
    const [subManufacturer, setSubManufacturer] = useState([])
    const [productTypes, setProductTypes] = useState([])
    const [productCategories, setProductCategories] = useState([])
    const [AccessibleComplaint, setAccessibleComplaint] = useState([])
    const [show, setShow] = useState(false);
    const [btnLoader, setBtnLoader] = useState(false)
    const [data, setData] = useState([])
    const [preview, setPreview] = useState(product?.image === undefined || product?.image === null || product?.image === ' ' ? undefined
        : `${product?.image}`)
    const [multiFiles, setMultiFiles] = useState([]);
    const [image, setImage] = useState(null);
    
    const [additionalInfo , setAdditonalInfo] = useState("")
    const [ifImageIsEmpty, setIfImageIsEmpty] = useState(false)
    const [listOfColor,setListOfColor] = useState([])
    const [mulFiles , setMulFiles] = useState([])

    const [fileshow, setFileShow] = useState(false);
    const [imageshow, setImageShow] = useState(false);
    const [deleteLoader, setDeleteLoader] = useState(false);
    const [deleteImageId, setDeleteImageId] = useState("");
    const [deleteFileId, setDeleteFileId] = useState("");
    const [titleList, setTitleList] = useState([]);

    const [productData, setProductDatas] = useState([])
    const endpoint = location.state?.apiPath;
    const level = location.state?.level;
    const id = location?.search?.split("?")[1]

    const [multipleManufacturer,setMultipleManufacturer] = useState([])
    const [multipleChildManufacturer,setMultipleChildManufacturer] = useState([])
    const [multipleSubChildManufacturer,setMultipleSubChildManufacturer] = useState([])

    const [multipleSegment,setMultipleSegment] = useState([])
    const [multipleChildSegment,setMultipleChildSegment] = useState([])
    const [multipleSubChildSegment,setMultipleSubChildSegment] = useState([])


    const [buildingTypes,setbuildingTypes] = useState([])

    const [productTypee,setProductTypee] = useState([])
    const [productTypeChilds,setProductTypeChilds] = useState([])

    const [categoryProduct,setCategoryProduct] = useState([])
    const [categoryProductChild,setCategoryProductChild] = useState([])
    const [categoryProductSubChild,setCategorySubProductChild] = useState([])


    const [accesibleCode,setaAccesibleCode] = useState([])
    const [scheduleeType,setScheduleeType] = useState([])




    const FileNameEnum = {}
    const param = useParams()

    const [row, setRow] = useState(new Array(7).fill({}))
    const history = useHistory();
    useEffect(() => {
        loadPage()
        getColorList()
        getListing()
    }, [])

    const getListing = async () => {
        try {
          let response = await API.getTitleListing();
          if (response?.success) {
            setTitleList(response?.data);
            // mapTitleList(response?.data)
          } else {
            toast.error(response?.message);
          }
        } catch (error) {
          return error;
        } 
    };

    const ProductList = async () => {
        setLoading(true);
        try {
            const response = await API.ProductList();
            const data = response.data;

            if (response.data) {
                const data1 = response?.data?.map((me) => {
                    return {
                        ...me,
                        label: me.name,
                        value: me._id,
                    }
                })

                let tempV = data1.filter((dt)=>{
                    if(dt._id !== id){
                        return dt
                    }
                })
                setProductDatas(tempV)


            }

        }
        catch (error) {
        }
        finally {
            setLoading(false)
        }
    }

    
    const mainChildMultiple = useMemo(() => {
        if (multipleManufacturer && multipleManufacturer?.length && manufactures?.length) {
            const ids = multipleManufacturer.map(wf=>wf._id || wf)
            const data = manufactures.filter(x => ids.includes(x._id)).map(mf=>mf?.child);
            return data.flat(1)
        }
        return [];
    }, [multipleManufacturer])

    // console.log(mainChildMultiple)

    const subChildMultiple = useMemo(() => {
        if (multipleChildManufacturer && multipleChildManufacturer?.length && mainChildMultiple?.length) {
            let arr = mainChildMultiple?.map((childs)=>{
                let arrChild = []
                if(childs?.child?.length>0){
                    childs?.child?.map((mapChild)=>{
                        arrChild.push(mapChild)
                    })
                }
                return arrChild
            })
            let flatArr = arr.flat(1)
            return flatArr
        }
        return [];
    }, [multipleChildManufacturer, mainChildMultiple]) 

    // console.log(subChildMultiple)

    // ********************segment***********************

    const mainSegmentChild = useMemo(() => {
        if (multipleSegment && multipleSegment?.length && curatedSelection?.length) {
            const ids = multipleSegment.map(wf=>wf._id || wf)
            const data = curatedSelection.filter(x => ids.includes(x._id)).map(mf=>mf?.child);
            return data.flat(1);

            
        }
        return [];
        
    }, [multipleSegment, curatedSelection])


    const subSegmentChild = useMemo(() => {
        if (multipleChildSegment && multipleChildSegment?.length && mainSegmentChild?.length) {
            let arr = mainSegmentChild?.map((childs)=>{
                let arrChild = []
                if(childs?.child?.length>0){
                    childs?.child?.map((mapChild)=>{
                        arrChild.push(mapChild)
                    })
                }
                return arrChild
            })
            let flatArr = arr.flat(1)
            return flatArr
        }
        return [];
    }, [multipleChildSegment, mainSegmentChild])


    //product type  function
    const mainProductTypeChild = useMemo(() => {
        if (productTypee && productTypee?.length && productTypes?.length) {
            const ids = productTypee.map(wf=>wf._id || wf)
            const data = productTypes.filter(x => ids.includes(x._id)).map(mf=>mf?.child);
            return data.flat(1);
        }
        return [];
    }, [productTypee, productTypes, setValue]) 



    //product Category  function
    const mainProductCategoryChild = useMemo(() => {
        if (categoryProduct && categoryProduct?.length && productCategories?.length) {
            const ids = categoryProduct.map(wf=>wf._id || wf)
            const data = productCategories.filter(x => ids.includes(x._id)).map(mf=>mf?.child);
            return data.flat(1);
        }
        return [];
    }, [categoryProduct, productCategories])


    const subProductCategoryChild = useMemo(() => {
        let arr = mainProductCategoryChild?.map((childs)=>{
            let arrChild = []
            if(childs?.child?.length>0){
                childs?.child?.map((mapChild)=>{
                    arrChild.push(mapChild)
                })
            }
            return arrChild
        })
        let flatArr = arr.flat(1)
        return flatArr
    }, [categoryProductChild, mainProductCategoryChild])



    const loadPage = async () => {
        try {
            const [manufactures, curatedSelection, BuildingType, ScheduleType, productTypes, productCategories, AccessibleComplaint] = await Promise.all([
                API.fetchListingData('data/manufacturer/hierarchy'),
                API.fetchListingData('data/curated_selection/hierarchy'),
                API.fetchListingData('data/building_type/hierarchy'),
                API.fetchListingData('data/schedule_type/hierarchy'),
                API.fetchListingData('data/product_type/hierarchy'),
                API.fetchListingData('data/product_category/hierarchy'),
                API.fetchListingData('data/accessible_complaint/hierarchy')

            ])

            if (manufactures?.success) {
                const data = manufactures.data

                let childData =[]
                let SubChildData =[]
                data?.map((cData)=>{
                    cData?.child?.map((ccData)=>{
                        childData.push(ccData)
                    })
                })
                childData?.map((cData)=>{
                    cData?.child?.map((ccData)=>{
                        SubChildData.push(ccData)
                    })
                })

                if(product?.manufacturerId?.length>0){
                    let flatArray = []
                    product?.manufacturerId?.map((mData)=>{
                        console.log(manufactures)
                        let obj = data?.find((md)=>md?._id === mData)
                        // console.log(obj)
                        let newObj = {
                            ...obj,
                            label: obj?.title,
                            value: obj?._id,
                        }
                        // console.log(newObj)
                        flatArray.push(newObj)
                    })
                    // console.log("flatflat",flatArray)
                    setMultipleManufacturer(flatArray)
                }

                if(product?.manufacturer2Id?.length>0){
                    let flatArray = []
                    product?.manufacturer2Id?.map((mData)=>{
                        let obj = childData?.find((md)=>md?._id === mData)
                        let newObj = {
                            ...obj,
                            label: obj?.title,
                            value: obj?._id,
                        }
                        flatArray.push(newObj)
                    })
                    setMultipleChildManufacturer(flatArray)
                }

                if(product?.manufacturer3Id?.length>0){
                    let flatArray = []
                    product?.manufacturer3Id?.map((mData)=>{
                        let obj = SubChildData?.find((md)=>md?._id === mData)
                        console.log(obj)
                        let newObj = {
                            ...obj,
                            label: obj?.title,
                            value: obj?._id,
                        }
                        flatArray.push(newObj)
                    })
                    console.log(flatArray)
                    setMultipleSubChildManufacturer(flatArray)
                }
                setManufactures([...data])

            }
            if (curatedSelection?.success) {
                const data = curatedSelection.data
                let childData =[]
                let SubChildData =[]
                data?.map((cData)=>{
                    cData?.child?.map((ccData)=>{
                        childData.push(ccData)
                    })
                })
                childData?.map((cData)=>{
                    cData?.child?.map((ccData)=>{
                        SubChildData.push(ccData)
                    })
                })


                if(product?.curatedSelectionId?.length>0){
                    let flatArray = []
                    product?.curatedSelectionId?.map((mData)=>{
                        console.log(manufactures)
                        let obj = data?.find((md)=>md?._id === mData)
                        // console.log(obj)
                        let newObj = {
                            ...obj,
                            label: obj?.title,
                            value: obj?._id,
                        }
                        // console.log(newObj)
                        flatArray.push(newObj)
                    })
                    // console.log("flatflat",flatArray)
                    setMultipleSegment(flatArray)
                }

                if(product?.curatedSelection2Id?.length>0){
                    let flatArray = []
                    product?.curatedSelection2Id?.map((mData)=>{
                        let obj = childData?.find((md)=>md?._id === mData)
                        let newObj = {
                            ...obj,
                            label: obj?.title,
                            value: obj?._id,
                        }
                        flatArray.push(newObj)
                    })
                    setMultipleChildSegment(flatArray)
                }

                if(product?.curatedSelection3Id?.length>0){
                    let flatArray = []
                    product?.curatedSelection3Id?.map((mData)=>{
                        let obj = SubChildData?.find((md)=>md?._id === mData)
                        console.log(obj)
                        let newObj = {
                            ...obj,
                            label: obj?.title,
                            value: obj?._id,
                        }
                        flatArray.push(newObj)
                    })
                    console.log(flatArray)
                    setMultipleSubChildSegment(flatArray)
                }

                setCuratedSelection([...data])

            }
            if (BuildingType?.success) {
                const data = BuildingType.data

                if(product?.buildingTypeId?.length>0){
                    let flatArray = []
                    product?.buildingTypeId?.map((mData)=>{
                        console.log(manufactures)
                        let obj = data?.find((md)=>md?._id === mData)
                        // console.log(obj)
                        let newObj = {
                            ...obj,
                            label: obj?.title,
                            value: obj?._id,
                        }
                        // console.log(newObj)
                        flatArray.push(newObj)
                    })
                    // console.log("flatflat",flatArray)
                    setbuildingTypes(flatArray)
                }


                setBuildingType([...data])

            }
            if (ScheduleType?.success) {
                const data = ScheduleType.data

                if(product?.scheduleTypeId?.length>0){
                    let flatArray = []
                    product?.scheduleTypeId?.map((mData)=>{
                        let obj = data?.find((md)=>md?._id === mData)
                        // console.log(obj)
                        let newObj = {
                            ...obj,
                            label: obj?.title,
                            value: obj?._id,
                        }
                        // console.log(newObj)
                        flatArray.push(newObj)
                    })
                    // console.log("flatflat",flatArray)
                    setScheduleeType(flatArray)
                }


                setScheduleType([...data])

            }
            if (productTypes?.success) {
                const data = productTypes.data
                let childData =[]
                data?.map((cData)=>{
                    cData?.child?.map((ccData)=>{
                        childData.push(ccData)
                    })
                })

                if(product?.typeId?.length>0){
                    let flatArray = []
                    product?.typeId?.map((mData)=>{
                        console.log(manufactures)
                        let obj = data?.find((md)=>md?._id === mData)
                        // console.log(obj)
                        let newObj = {
                            ...obj,
                            label: obj?.title,
                            value: obj?._id,
                        }
                        // console.log(newObj)
                        flatArray.push(newObj)
                    })
                    // console.log("flatflat",flatArray)
                    setProductTypee(flatArray)
                }

                if(product?.type2Id?.length>0){
                    let flatArray = []
                    product?.type2Id?.map((mData)=>{
                        let obj = childData?.find((md)=>md?._id === mData)
                        let newObj = {
                            ...obj,
                            label: obj?.title,
                            value: obj?._id,
                        }
                        flatArray.push(newObj)
                    })
                    setProductTypeChilds(flatArray)
                }

                setProductTypes([...data])
            }
            if (productCategories?.success) {
                const data = productCategories.data
                let childData =[]
                let SubChildData =[]
                data?.map((cData)=>{
                    cData?.child?.map((ccData)=>{
                        childData.push(ccData)
                    })
                })
                childData?.map((cData)=>{
                    cData?.child?.map((ccData)=>{
                        SubChildData.push(ccData)
                    })
                })

                if(product?.categoryId?.length>0){
                    let flatArray = []
                    product?.categoryId?.map((mData)=>{
                        console.log(manufactures)
                        let obj = data?.find((md)=>md?._id === mData)
                        // console.log(obj)
                        let newObj = {
                            ...obj,
                            label: obj?.title,
                            value: obj?._id,
                        }
                        // console.log(newObj)
                        flatArray.push(newObj)
                    })
                    // console.log("flatflat",flatArray)
                    setCategoryProduct(flatArray)
                }

                if(product?.category2Id?.length>0){
                    let flatArray = []
                    product?.category2Id?.map((mData)=>{
                        let obj = childData?.find((md)=>md?._id === mData)
                        let newObj = {
                            ...obj,
                            label: obj?.title,
                            value: obj?._id,
                        }
                        flatArray.push(newObj)
                    })
                    setCategoryProductChild(flatArray)
                }

                if(product?.category3Id?.length>0){
                    let flatArray = []
                    product?.category3Id?.map((mData)=>{
                        let obj = SubChildData?.find((md)=>md?._id === mData)
                        console.log(obj)
                        let newObj = {
                            ...obj,
                            label: obj?.title,
                            value: obj?._id,
                        }
                        flatArray.push(newObj)
                    })
                    console.log(flatArray)
                    setCategorySubProductChild(flatArray)
                }

                setProductCategories([...data])
            }
            if (AccessibleComplaint?.success) {
                const data = AccessibleComplaint.data

                if(product?.accessibleComplaintId?.length>0){
                    let flatArray = []
                    product?.accessibleComplaintId?.map((mData)=>{
                        let obj = data?.find((md)=>md?._id === mData)
                        // console.log(obj)
                        let newObj = {
                            ...obj,
                            label: obj?.title,
                            value: obj?._id,
                        }
                        // console.log(newObj)
                        flatArray.push(newObj)
                    })
                    // console.log("flatflat",flatArray)
                    setaAccesibleCode(flatArray)
                }

                setAccessibleComplaint([...data])
            }
            // if (id !== undefined) {
            //     productEditGet()
            // }
            ProductList()
        }
        catch (e) {
            console.error(e)

            toast.error("Network Error")
        }
        finally {
            setLoading(false)
        }
    }

    const onSelect = (e) => {
    }



    const ProductUpdate = async (data, temp, selected) => {
        let titelObj={
            manufacturerId:multipleManufacturer,manufacturer2Id:multipleChildManufacturer,manufacturer3Id:multipleSubChildManufacturer,
            curatedSelectionId:multipleSegment,curatedSelection2Id:multipleChildSegment,curatedSelection3Id:multipleSubChildSegment,
            buildingTypeId:buildingTypes,typeId:productTypee,type2Id:productTypeChilds,
            categoryId:categoryProduct,category2Id:categoryProductChild,category3Id:categoryProductSubChild,
            accessibleComplaintId:accesibleCode,scheduleTypeId:scheduleeType
        }
        let isImg = false
        let isFile = false
        let isUrl = false
        let expression = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        var regex = new RegExp(expression)
        let datas = imageArray
        let FileData = mulFiles
        data["additional_info"] = additionalInfo
        datas?.forEach((item) => {
            if (item.fileName === '') {
                setIfImageIsEmpty(true)
                isImg=true
            }
        })
        FileData?.forEach((item)=>{
            if(item?.docName === ''){
                isFile=true
            }
            else{
                if((item?.docFile === undefined || item?.docFile === '') &&  item?.linkPath ===""){
                    isFile=true

                }
                else{
                    isFile=false
                }
                if(item?.linkPath !==""){
                    if(!item?.linkPath?.match(regex)){
                        isUrl= true
                    }
                    else{
                        isUrl= false
                    }
                }
            }
            
        })
        if (isImg) {
            toast.error('Please select image with color first.')
        }
        else if(isFile){
            toast.error('Please select file with filename first.')
        }
        else if(isUrl){
            toast.error('Please select valid file URL.')
        }
        else {
            setLoading(true)
            delete data["relatedProducts"]
            let images = imageArray?.filter((item) => {
                if (item._id === undefined) {
                    return item
                }
            })
            let oldImages = imageArray?.filter((item) => {
                if (item._id !== undefined) {
                    return item
                }
            })

            let files = mulFiles?.filter((item) => {
                if (item._id === undefined) {
                    return item
                }
            })
            let oldFiles = mulFiles?.filter((item) => {
                if (item._id !== undefined) {
                    return item
                }
            })


            try {
                const response = await API.updateProduct(id, data, selected, images, oldImages ,files ,oldFiles,titelObj);
                if (response.success) {
                    toast.success(response.message)
                    history.goBack();
                }
                else {
                    toast.error(response.data?.message)
                }
            }
            catch (error) {
            }
            finally {
                setLoading(false)

            }
        }
    }


    const onSubmit = async (data) => {
        const uniqueModelNames = {};
        let hasDuplicates = false;
        for (const item of imageArray) {
            const modelName = item.modelName;
            
            if (uniqueModelNames[modelName]) {
                hasDuplicates = true;
                break;
            } else {
                uniqueModelNames[modelName] = true;
            }
        }


        let titelObj={
            manufacturerId:multipleManufacturer,manufacturer2Id:multipleChildManufacturer,manufacturer3Id:multipleSubChildManufacturer,
            curatedSelectionId:multipleSegment,curatedSelection2Id:multipleChildSegment,curatedSelection3Id:multipleSubChildSegment,
            buildingTypeId:buildingTypes,typeId:productTypee,type2Id:productTypeChilds,
            categoryId:categoryProduct,category2Id:categoryProductChild,category3Id:categoryProductSubChild,
            accessibleComplaintId:accesibleCode,scheduleTypeId:scheduleeType
        }
        let isImg = false
        let isFile = false
        let datas = imageArray
        let FileData = mulFiles
        let isUrl = false
        let expression = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        var regex = new RegExp(expression)
        data["additional_info"] = additionalInfo
        datas?.forEach((item) => {
            if (item.fileName === '' || item.code === '') {
                setIfImageIsEmpty(true)
                isImg=true
            }
        })
        FileData?.forEach((item)=>{
            if(item?.docName === ''){
                isFile=true
            }
            else{
                if((item?.docFile === undefined || item?.docFile === '') &&  item?.linkPath ===""){
                    isFile=true

                }
                
                if(item?.linkPath !==""){
                    if(!item?.linkPath?.match(regex)){
                        isUrl= true
                    }
                    
                }
            }
        })
        if (!data.name) {
           return toast.error('Please enter product name first.')
        }
        else if (isImg) {
           return toast.error('Please select image with color first.')
        } 
        else if(isFile){
            return toast.error('Please select file with filename first.')
        }
        else if(isUrl){
          return  toast.error('Please select valid file URL.')
        }
        else if(hasDuplicates){
            return toast.error('Model number can not be same.')
        }
        else {
        if (fileError === "") {
            let result = row.filter(me => me.file !== undefined)
            var newObj = Object.assign({}, ...(result.map(item => ({ [item.label.key]: item.file }))));
            Object.assign(data, newObj)
            let selected = selectedProduct?.map(me => me._id)
            delete data.productFiles
            let images = imageArray;
            // data['relatedProducts'] = selected;
            if (id !== undefined) {
                ProductUpdate(data, row, selected)
            }
            else {
                setLoading(true)
                try {
                    const response = await API.addProduct(data, selected, images ,mulFiles,titelObj)

                    console.log("item",response)
                    
                    if (response?.success) {
                        toast.success(response?.message);
                        history.goBack();
                    }
                    else{
                        toast.error(response?.data?.message)
                    }
                }
                catch (e) {
                }
                finally {
                    setLoading(false)
                }
            }
        }
    }
    };



    const handleAddDocMul = () =>{
        let param ={docName:"",docFile:"",linkName:"",linkPath:""}
        setMulFiles([...mulFiles,param])
    }


    const handleMultipleFile = (e,index,key) =>{
        if(key === "a"){
            let value = e.target.value
            let newvalue = value?.charAt(0).toUpperCase() + value?.slice(1)
            let result = mulFiles.map((file,idx)=>{
                if(index === idx){
                    return {...file , docName:newvalue}
                }
                else{
                    return {...file}
                }
            })
            setMulFiles([...result])
        }
        else if(key === "b"){
            let files = e.target.files[0]
            let result = mulFiles.map((file,idx)=>{
                if(index === idx){
                    return {...file , docFile:files}
                }
                else{
                    return {...file}
                }
            })
            setMulFiles([...result])
        }
        else if(key === "c"){
            let value = e.target.value
            let newvalue = value?.charAt(0).toUpperCase() + value?.slice(1)
            let result = mulFiles.map((file,idx)=>{
                if(index === idx){
                    return {...file , linkName:newvalue}
                }
                else{
                    return {...file}
                }
            })
            setMulFiles([...result])
        }
        else if(key === "d"){
            let value = e.target.value
            let result = mulFiles.map((file,idx)=>{
                if(index === idx){
                    return {...file , linkPath:value}
                }
                else{
                    return {...file}
                }
            })
            setMulFiles([...result])
        }
    }


    const removeMulFile = (index) =>{
        let result = mulFiles.filter((file,idx)=>{
            if(index !== idx){
                return file
            }
        })
        setMulFiles([...result])
    }

    const getDocName = (i) => {
        switch (i + 1) {
            case 1:
                return {
                    label: 'Maintenance and Parts',
                    key: 'maintenance_and_part'
                }
            case 2:
                return {
                    label: 'Maintenance & Installation',
                    key: 'maintenance_and_installation'
                }
            case 3:
                return {
                    label: 'Repair Parts Diagram ',
                    key: 'repair_parts_diagram'
                }
            case 4:
                return {
                    label: 'Spec Sheets & Drawings',
                    key: 'spec_sheets_drawings'
                }

            case 5:
                return {
                    label: 'Specification Sheet (Series Specific)',
                    key: 'specification_sheet_series_specific'
                }
            case 6:
                return {
                    label: 'Specification (Model Specific) ',
                    key: 'specifications_model_specific',
                }
            case 7:
                return {
                    label: 'REVIT',
                    key: 'revit',
                }
        }
    }

    const getDocNameByLabel = (label) => {
        switch (label) {
            case 'maintenance_and_part':
                return {
                    label: 'Maintenance and Parts',
                    key: 'maintenance_and_part'
                }
            case 'maintenance_and_installation':
                return {
                    label: 'Maintenance & Installation',
                    key: 'maintenance_and_installation'
                }
            case 'repair_parts_diagram':
                return {
                    label: 'Repair Parts Diagram ',
                    key: 'repair_parts_diagram'
                }
            case 'spec_sheets_drawings':
                return {
                    label: 'Spec Sheets & Drawings',
                    key: 'spec_sheets_drawings'
                }

            case 'specification_sheet_series_specific':
                return {
                    label: 'Specification Sheet (Series Specific)',
                    key: 'specification_sheet_series_specific'
                }
            case 'specifications_model_specific':
                return {
                    label: 'Specification (Model Specific) ',
                    key: 'specifications_model_specific',
                }
            case 'revit':
                return {
                    label: 'REVIT',
                    key: 'revit',
                }
        }
    }



    useEffect(() => {
        if (product.productFiles && product.productFiles?.length > 0) {


            let result = product.productFiles.map((me, i) => {
                return { ...me, label: getDocNameByLabel(me.label) }

            })

            let emptyObj = new Array(7 - result.length).fill({})


            result = [...result, ...emptyObj]


            setRow([...result])

        }
    }, [product.productFiles])

    const handleDeleteFile = (id) =>{
        setDeleteFileId(id)
        setFileShow(true)
    }

    const onCloseIcon = async () => {
        setDeleteLoader(true)
        try {
            let params = {
                id: deleteFileId,
                productId: id

            }
            const response = await API.deleteFileFromProduct(params)

            const data = response?.data
            if (response.success
            ) {
                toast.success(response.message)
                handleClose()
                props.reloadData()
            }
            else {
                toast.error(response.message)

            }
        }

        catch (e) {
            console.error(e)
            toast.success('Network Error')
        }
        finally {
            setDeleteLoader(false)
        }
    }


    const onProductSelect = (selected) => {
        setSelectedProduct([...selected])
    }

    const handleImageSet = (e, idx) => {
        let img = e.target.files[0]
        let data = imageArray
        let result = data.map((item, itemIdx) => {
            if (idx === itemIdx) {
                return { ...item, fileName: img }
            }
            else {
                return { ...item }
            }
        })

        setImageArray([...result])

        setImage(e.target.files[0])
        setPreview(URL.createObjectURL(e.target.files[0]));
    }

    const handleColorChange = (e, idx) => {
        let value = e.target.value

        let resultColorCode = listOfColor.find((items) => {
            if (items?._id === value) {
                return { ...items }
            }
        })
        let data = imageArray
        let result = data.map((item, dataIdx) => {
            if (idx === dataIdx) {
                return { ...item, code: resultColorCode.code,
                     colorValue: resultColorCode?.name,id:resultColorCode._id}
            }
            else {
                return { ...item }
            }
        })
        setImageArray([...result])
    }

    const addImagesFile = (idx , item) => {

        console.log({item})
        console.log("item",imageArray)

        let params = { fileName: '', code: '',modelName:'',id:'',color:'' }

        if(imageArray?.find((me,idxx)=> idx!==idxx && me?.modelName === item?.modelName) ){
            toast.error("Model number can not be same.")
        }

        else{
            imageArray.map((item, itemIdx) => {
                if (itemIdx === idx) {
                    if (item.code !== '' && item.fileName !== '' && item.modelName !== '') {
                        setImageArray([...imageArray, params])
                    }
                    else {
                        toast.error("Please select image with color and model first.")
                    }
                }
            })
        }

    }

   
    useEffect(() => {
        setImages()
        setFiles()
        setAdditonalInfo(props?.product?.additional_info)
    }, [props?.product])

    const setImages = () => {
        let dataOfProduct = props?.product
        if (dataOfProduct?.images && dataOfProduct?.images?.length>0) {
            setImageArray(dataOfProduct?.images)
        }
        else {
            setImageArray([{ fileName: '', code: '' ,modelName:'' ,id:'',color:''},
            ])
        }

    }

    const setFiles =()=>{
        let dataOfProduct = props?.product
        if (dataOfProduct?.productFiles && dataOfProduct?.productFiles?.length>0) {
            setMulFiles(dataOfProduct?.productFiles)
        }
        else {
            setMulFiles([])
        }
    }

    const deleteImage = (idx) => {

        if (imageArray?.length === 1) {
            setImageArray([emptyImageObject])

            setImage(null)
            setPreview(undefined);

        }
        else {
            let data = imageArray
            let result = data.filter((item, itemIdx) => {
                if (itemIdx !== idx) {
                    return item
                }
            })
            setImageArray([...result])

        }
    }

    const handleDeleteImage = (id) =>{
        setDeleteImageId(id)
        setImageShow(true)
    }

    const deleteImageApi = async () =>{
        setDeleteLoader(true)
        try{
            let response = await API.deleteImageFromProduct(id,deleteImageId)
            if (response.success) {
                toast.success(response.message)
                handleClose()
                props.reloadData()
                }
            else {
                toast.error(response.message)
            }
        }
        catch(error){
            return error
        }
        finally{
        setDeleteLoader(false)
        }
    }

    const getColorList = async () => {
        try{
            const response = await API.fetchColorList()
            if(response.success){
                setListOfColor(response?.data)
            }
        }catch(error){
        }
    }

    const handleImageInput = (e,idx) =>{
        let inputValue= e.target.value
        let result = imageArray.map((item,index)=>{
            if(index === idx){
                return { ...item, modelName: inputValue}
            }
            else{
                return {...item }
            }
        })
        setImageArray([...result])
    }
    
    const handleClose = () => {
        setFileShow(false)
        setImageShow(false)
    }

    // ********************manufacturer**************************

    const onManuFacturerSelect = (selected) =>{
        // console.log(selected)
        if(selected)
        setMultipleManufacturer([...selected])
    }
    const onChildManuFacturerSelect = (selected) =>{
        if(selected)
        setMultipleChildManufacturer([...selected])
        
    }
    const onSubChildManuFacturerSelect = (selected) =>{
        if(selected)
        setMultipleSubChildManufacturer([...selected])
    }

    // ********************segment**************************    

    const onSegmentSelect = (selected) =>{setMultipleSegment([...selected])
    }
    const onChildSegmentSelect = (selected) =>{setMultipleChildSegment([...selected])
    }
    const onSubChildSegmentSelect = (selected) =>{setMultipleSubChildSegment([...selected])
    }

    const onBuildingSelect = (selected) =>{setbuildingTypes([...selected])
    }

    const onProductTypeSelect = (selected) =>{setProductTypee([...selected])
    }
    const onProductTypeChildSelect = (selected) =>{setProductTypeChilds([...selected])
    }

    const onAcccesibleSelect = (selected) =>{setaAccesibleCode([...selected])
    }
    const onSchedulesTypeChildSelect = (selected) =>{setScheduleeType([...selected])
    }

    // **********************productCategory********************

    const onCategoryProductSelect = (selected) =>{setCategoryProduct([...selected])
    }
    const onCategoryChildProductSelect = (selected) =>{setCategoryProductChild([...selected])
    }
    const onSubCategoryProductSelect = (selected) =>{setCategorySubProductChild([...selected])
    }


    // useEffect(()=>{
        
    // },[])

    console.log(categoryProductSubChild)

    const getFormattedValue = (value) =>{
        console.log(value)
        setAdditonalInfo(value)
    }

    console.log("asdfsdffd" , product)
    
   

    return (
        <React.Fragment>
            {loading ? <div className="loadercss"><ClipLoader color={'black'} loading={loading} size={50} /> </div> :
                <div className="content mb-5">
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md="12">
                                <Card className='p-3'>
                                    <CardHeader className='pl-0'>
                                        <CardTitle tag="h3">Manage Product</CardTitle>
                                    </CardHeader>
                                   { titleList?.find((titl) => titl?.id === 1)?.status === 1 &&
                                     <Row>
                                        <Col md="4">
                                        
                                            <label style={{ fontSize: '14px' }}>{titleList?.find((titl) => titl?.id === 1)?.name}</label>
                                            <MultiSelectManu data={manufactures}
                                                select={"Select options"}
                                                onProductSelect={onManuFacturerSelect}
                                                mapManu={product?.manufacturerId || []}
                                                reRender = {multipleManufacturer}
                                            /> 
                                            
                                        </Col>
                                        <Col md="4">

                                        
                                            

                                            <label style={{ fontSize: '14px' }}>{titleList?.find((titl) => titl?.id === 1)?.name} Category Type</label>
                                            <MultiSelectManu 
                                                data={mainChildMultiple}
                                                select={"Select options"}
                                                onProductSelect={onChildManuFacturerSelect} 
                                                mapManu={product.manufacturer2Id  || []}
                                                // parentData={manufactures} 
                                                reRender = {multipleChildManufacturer} 

                                            /> 

                                        </Col>
                                        <Col md="4">
                                           

                                            <label style={{ fontSize: '14px' }}>{titleList?.find((titl) => titl?.id === 1)?.name} Sub Category</label>
                                            <MultiSelectManu data={subChildMultiple}
                                                select={"Select options"}
                                                onProductSelect={onSubChildManuFacturerSelect}
                                                mapManu={product.manufacturer3Id || []}
                                                reRender = {multipleSubChildManufacturer}
                                                
                                                
                                            /> 
                                        </Col>
                                    </Row>}

    

                                    {titleList?.find((titl) => titl?.id === 2)?.status === 1 &&
                                        <Row>
                                        <Col md="4">
                                            
                                            <label style={{ fontSize: '14px' }}>{titleList?.find((titl) => titl?.id === 2)?.name}</label>
                                            <MultiSelectManu data={curatedSelection}
                                                select={"Select options"}
                                                onProductSelect={onSegmentSelect}
                                                mapManu={product.curatedSelectionId || []}
                                                reRender = {multipleSegment}

                                            /> 

                                        </Col>
                                        <Col md="4">
                                            

                                            <label style={{ fontSize: '14px' }}>{titleList?.find((titl) => titl?.id === 2)?.name} Category</label>
                                            <MultiSelectManu data={mainSegmentChild}
                                                select={"Select options"}
                                                onProductSelect={onChildSegmentSelect}
                                                mapManu={product.curatedSelection2Id || []}
                                                reRender = {multipleChildSegment}

                                            />   

                                        </Col>
                                        <Col md="4">
                                            

                                            <label style={{ fontSize: '14px' }}>{titleList?.find((titl) => titl?.id === 2)?.name} Sub Category</label>
                                            <MultiSelectManu data={subSegmentChild}
                                                select={"Select options"}
                                                onProductSelect={onSubChildSegmentSelect}
                                                mapManu={product.curatedSelection3Id || []}
                                                reRender = {multipleSubChildSegment}

                                            />   
                                        </Col>
                                    </Row>}
                                    {/* Building type  */}

                                    <Row>
                                        {titleList?.find((titl) => titl?.id === 6)?.status === 1 &&
                                            <Col md="4">
                                           
                                            <label style={{ fontSize: '14px' }}>{titleList?.find((titl) => titl?.id === 6)?.name}</label>
                                            <MultiSelectManu data={BuildingType}
                                                select={"Select options"}
                                                onProductSelect={onBuildingSelect}
                                                mapManu={product.buildingTypeId || []}
                                                reRender = {buildingTypes}

                                            /> 

                                        </Col>}
                                    {/* Product type  */}

                                        {titleList?.find((titl) => titl?.id === 4)?.status === 1 &&
                                             <><Col md="4">

                                            <label style={{ fontSize: '14px' }}>{titleList?.find((titl) => titl?.id === 4)?.name}</label>
                                            <MultiSelectManu data={productTypes}
                                                select={"Select options"}
                                                onProductSelect={onProductTypeSelect}
                                                mapManu={product.typeId || []}
                                                reRender = {productTypee}

                                            /> 

                                        </Col>
                                        <Col md="4">
                                        
                                            <label style={{ fontSize: '14px' }}>{titleList?.find((titl) => titl?.id === 4)?.name} Child Category</label>
                                            <MultiSelectManu data={mainProductTypeChild}
                                                select={"Select options"}
                                                onProductSelect={onProductTypeChildSelect}
                                                mapManu={product.type2Id || []}
                                                reRender = {productTypeChilds}

                                            /> 

                                        </Col></>}
                                    </Row>

                                    {/* Schedule Type */}

                                   {titleList?.find((titl) => titl?.id === 3)?.status === 1 &&
                                     <Row>
    
                                        {/*Product category  type     */}
                                        <Col md="4">
                                            
                                            <label style={{ fontSize: '14px' }}>{titleList?.find((titl) => titl?.id === 3)?.name}</label>
                                            <MultiSelectManu data={productCategories}
                                                select={"Select options"}
                                                onProductSelect={onCategoryProductSelect}
                                                mapManu={product.categoryId || []}
                                                reRender = {categoryProduct}

                                            /> 
                                        </Col>
                                        <Col md="4">
                                            

                                            <label style={{ fontSize: '14px' }}>{titleList?.find((titl) => titl?.id === 3)?.name} Child </label>
                                            <MultiSelectManu data={mainProductCategoryChild}
                                                select={"Select options"}
                                                onProductSelect={onCategoryChildProductSelect}
                                                mapManu={product.category2Id || []}
                                                reRender = {categoryProductChild}

                                            /> 
                                        </Col>
                                        <Col md="4">
                                           
                                            <label style={{ fontSize: '14px' }}>{titleList?.find((titl) => titl?.id === 3)?.name} Child Category</label>
                                            <MultiSelectManu data={subProductCategoryChild}
                                                select={"Select options"}
                                                onProductSelect={onSubCategoryProductSelect}
                                                mapManu={product.category3Id || []}
                                                reRender = {categoryProductSubChild}

                                            /> 
                                        </Col>
                                    </Row>}

                                    <Row>
                                        {titleList?.find((titl) => titl?.id === 5)?.status === 1 &&
                                        <Col md="4">
                                           
                                            <label style={{ fontSize: '14px' }}>{titleList?.find((titl) => titl?.id === 5)?.name}</label>
                                            <MultiSelectManu data={AccessibleComplaint}
                                                select={"Select options"}
                                                onProductSelect={onAcccesibleSelect}
                                                mapManu={product.accessibleComplaintId || []}
                                                reRender = {accesibleCode}

                                            />  
                                        </Col>}
                                        {titleList?.find((titl) => titl?.id === 7)?.status === 1 &&
                                            <Col md="4">
                                            

                                            <label style={{ fontSize: '14px' }}>{titleList?.find((titl) => titl?.id === 7)?.name}</label>
                                            <MultiSelectManu data={ScheduleType}
                                                select={"Select options"}
                                                onProductSelect={onSchedulesTypeChildSelect}
                                                mapManu={product.scheduleTypeId || []}
                                                reRender = {scheduleeType}

                                            /> 
                                        </Col>}



                                        <Col md="4">
                                            <InputBox type="text" placeholder="Product Line"
                                             label="Product Line" name="productLine" control={control} />
                                        </Col>

                                    </Row>



                                    <Row>
                                        <Col md="12" lg="4">
                                            <InputBox label="Name" type="text" placeholder="Product Name"
                                                name="name" control={control} />
                                        </Col>
                                        <Col md="12" lg="8">
                                            <div className='main'>
                                                {imageArray?.map((item, index) => (
                                                    <Row className='colorBody'>
                                                        <Col md="3" sm="3" lg="3">
                                                            <Row>
                                                                <Col md="8" sm="10" lg="8" xs='9' className='file-name-label'>
                                                                    <label className='fileLabel'>Select Image</label>
                                                                    <label className='file-name-inner'>
                                                                        {item._id === undefined ? <>
                                                                            <input className='d-none my-1' type="file"
                                                                                placeholder="Select Image"
                                                                                onClick={(e)=>{
                                                                                    e.target.value = null
                                                                                }}
                                                                                onChange={(e) => handleImageSet(e, index)} accept='.png,.jpg,.jpeg'
                                                                            />
                                                                            <span className='inputfiles'>
                                                                                {item.fileName === '' ?
                                                                                    "Choose file" :
                                                                                    item?.fileName?.name
                                                                                }
                                                                            </span>
                                                                        </> : <>
                                                                            <span className='inputfiles'>
                                                                                {item?.fileName}
                                                                            </span>

                                                                        </>
                                                                        }
                                                                    </label>
                                                                    
                                                                </Col>
                                                                
                                                                <Col lg="4" md="4" sm="2" xs='3'>
                                                                    {item._id ?
                                                                        (item?.fileName !== '' ? <div className='imagepreview' style={{ marginTop: '15px' }}>
                                                                            <img src={process.env.REACT_APP_FILE_PATH_UPLOAD +"/"+ item.fileName}
                                                                                className="image-fluid " />
                                                                        </div> : "") :
                                                                        (item?.fileName !== '' ? <div className='imagepreview' style={{ marginTop: '15px' }}>
                                                                            <img src={item?.fileName && URL?.createObjectURL(item?.fileName)}
                                                                                className="image-fluid " />
                                                                        </div> : "")}
                                                                </Col>

                                                            </Row>
                                                        </Col>
                                                        <Col md="3" sm="3" lg="3">
                                                            <label>Model no</label>
                                                            <input className='image-input' value={item?.modelName}
                                                            onChange={(e)=> handleImageInput(e,index)} />
                                                        </Col>
                                                        <Col lg="6" md="6" sm="6" className='marginForImage'>
                                                            <Row>
                                                                <Col lg="2" md="2" sm="2" xs='2' className='d-flex align-items-center'>
                                                                    <div className="colorContainer" style={{ backgroundColor: `${item?.code  ? item?.code : item?.color}` }}>
                                                                    </div>
                                                                </Col>
                                                                <Col lg="10" md="10" sm="10" xs='10' className='colorBox'>
                                                                    {item._id ?
                                                                        <select className="selectColor" name="color"
                                                                            onChange={(e) => handleColorChange(e, index,item?._id)}
                                                                             value={item?.id ? item?.id : (item?.color === "" ? "":item?.color) } id="color">
                                                                            <option disabled selected>{"Choose color"}</option>

                                                                            {listOfColor.map((items) => (
                                                                                <option value={items?._id}>{items?.name}</option>
                                                                            ))}
                                                                        </select> :
                                                                        <select className="selectColor" name="color"
                                                                            onChange={(e) => handleColorChange(e, index,item?._id)} value={item?.id} id="color">
                                                                            <option disabled value={""} selected>{"Choose color"}</option>

                                                                            {listOfColor.map((items) => (
                                                                                <option value={items?._id}>  {items?.name}</option>
                                                                            ))}
                                                                        </select>
                                                                    }
                                                                    {/* {<button className="priBtn" type="button"
                                                                        onClick={() => handleColorChange(index)}
                                                                    >
                                                                        {color ? "Choose Color" : "Choose Color"}
                                                                    </button>} */}
                                                                    {/* {color === index &&
                                                                        <>
                                                                            {<div className='picker'>
                                                                                <SketchPicker color={item?.color}
                                                                                    onChange={colors => colorCodechange(colors, index)} />
                                                                            </div>}
                                                                        </>
                                                                    } */}
                                                                    {imageArray?.length - 1 === index && <AiOutlinePlusCircle className='plus' onClick={() => addImagesFile(index , item)} size={30} />}

                                                                    {item?._id === undefined ? 
                                                                    <img style={{marginRight:'15px'}} onClick={() => deleteImage(index)} src={CloseIcon} /> :
                                                                    <img style={{width:'25px'}} onClick={() => handleDeleteImage(item?._id)} src={deleteIcon} /> 
                                                                    }
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                ))}
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md="6">
                                            <InputBox label="Activation Type" type="text" placeholder="Activation Type"
                                                name="activationType" control={control} />
                                        </Col>
                                        <Col md="6">
                                            <InputBox label="Complies With" type="text"
                                                placeholder="Complies With" name="complies" control={control} />
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md="6">
                                            <InputBox label="Country" type="text" placeholder="Country" name="country" control={control}
                                            />
                                        </Col>
                                        <Col md="6">
                                            <InputBox label="Function Type" type="text"
                                                placeholder="Function Type"
                                                name="functionType" control={control} />
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md="6">
                                            <InputBox label="Group" placeholder="Groups" type="text" name="group" control={control} />
                                        </Col>
                                        <Col md="6">
                                            <InputBox label="Model Group(Series)" placeholder="Model Group
                                        (Series)" type="text" name="modelGroup" control={control} />
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md="6">
                                            <InputBox label="Operation" type="text" placeholder="Operation" name="operation" control={control} />
                                        </Col>
                                        <Col md="6">
                                            <InputBox type="text" placeholder="Product Group" label="Product Group" name="productGroup" control={control} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="6"> <label style={{ fontSize: '14px' }}>Select Related Products</label>
                                            <MultiSelectBox data={productData} onProductSelect={onProductSelect} mapProduct={product?.relatedProducts} />
                                        </Col>
                                        <Col md="6">
                                            <InputBox style={"bigTextBox"} type="textarea" placeholder="Description" label="Description" name="description" control={control} />
                                        </Col>

                                    </Row>
                                    <Row>
                                        <RichTextEditor value={additionalInfo} getFormattedValue={getFormattedValue} />
                                    </Row>
                                    <Row>
                                        <Col md="12">
                                            <div>
                                                <label className='my-2' style={{ fontSize: '14px' }}>Select Files</label>
                                            </div>
                                            
                                            { mulFiles.length!==0 && mulFiles.map((file,index)=>(
                                                <div className='selectFiles'>
                                                <div className='selectFilesRow'>
                                                    <input onChange={(e)=>handleMultipleFile(e,index,"a")} value={file?.docName} 
                                                    className='inp' placeholder='Enter file name'/>
                                                    {(file?._id && file?.originalname !== "") ?
                                                        <span>
                                                        <a  href={process.env.REACT_APP_FILE_PATH_UPLOAD +"/"+file?.docFile}
                                                        style={{color:'white'}} download target={"_blank"}>{file?.originalname}</a>
                                                        </span>
                                                        :
                                                        <label>
                                                     <input onChange={(e)=>handleMultipleFile(e,index,"b")} 
                                                     className='d-none my-1' type="file" placeholder="Select Image" 
                                                     accept='.pdf,.doc,' />
                                                     <span className='inputfiless'>
                                                        {(file?.docFile === '' || file?.docFile === undefined) ?
                                                            "Choose file" :
                                                            file?.docFile?.name
                                                        }
                                                       </span>
                                                      </label>
                                                     }
                                                </div>
                                                <div className='selectFilesRow'>
                                                    <div className='Or'><p>OR</p></div>
                                                    <input onChange={(e)=>handleMultipleFile(e,index,"d")} value={file?.linkPath}
                                                     placeholder='Enter link' className='inp'/>
                                                    { file?._id ?
                                                    <img src={deleteIcon} onClick={()=>handleDeleteFile(file?._id)} /> :
                                                    <img className='crossIcon' src={CloseIcon} onClick={()=>removeMulFile(index)}/>
                                                    }
                                                </div>
                                            </div>
                                            )) }
                                            <button className="primaryy" type="button" onClick={() => handleAddDocMul()} >Add Doc</button>

                                        </Col>
                                        

                                        <Col md="6">

                                        </Col>
                                    </Row>
                                    <Row className='my-5'>
                                        <Col md="5"></Col>
                                        <Col md="3">
                                            <Button label="Submit" loading={btnLoader} />
                                        </Col>


                                        <Col md="4">

                                        </Col>

                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Form>
                </div>}
            {fileshow && <ModalC message="Are you sure you want to cancel?" title="Delete" show={true} handleClose={handleClose} deleteLoader={deleteLoader} handleYes={onCloseIcon} />}
            {imageshow && <ModalC message="Are you sure you want to cancel?" title="Delete" show={true} handleClose={handleClose} deleteLoader={deleteLoader} handleYes={deleteImageApi} />}

        </React.Fragment>
    )
}

const Wrapper = () => {
    //api calls
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const id = location?.search?.split("?")[1]
    useEffect(() => {
        if (id) productEditGet()
        else setLoading(false)
    }, [id])

    const productEditGet = async () => {
        try {
            const response = await API.productEditGet(id);
            if (response.success) {
                const data = response.data;
                setData({ ...data, image: process.env.REACT_APP_FILE_PATH +"/"+data.image })
            }
            else {
                toast.error(response.message)
            }
        }
        catch (e) {
        } finally {
            setLoading(false);
        }
    }

    if (loading) return


    // no data  show loader

    return <AddProductForm product={data} reloadData={productEditGet} />
}
export default Wrapper;