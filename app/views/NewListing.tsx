import FormInput from "@ui/FormInput";
import { FC, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  FlatList,
  Image,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import colors from "@utils/colors";
import DatePicker from "@ui/DatePicker";
import OptionModal from "@components/OptionModal";
import categories from "@utils/categories";
import CategoryOptions from "@ui/CategoryOptions";
import AntDesign from "@expo/vector-icons/AntDesign";
import AppButton from "@ui/AppButton";
import CustomkeyAvoidingView from "@ui/CustomkeyAvoidingView";
import * as ImagePicker from "expo-image-picker";
import { showMessage } from "react-native-flash-message";
import HorizontalImageList from "@components/HorizontalImageList";
import { newProductSchema, yupValidate } from "@utils/validator";
import mime from "mime";
import useClient from "@hooks/useClient";
import { runAxiosAsync } from "@api/runAxiosAsync";
import LoadingSpinner from "@ui/LoadingSpinner";

interface Props {}

const defaultInfo = {
  name: "",
  description: "",
  category: "",
  price: "",
  purchasingDate: new Date(),
};

const imageOptions = [
  {
    value: "Remove Image",
    id: "remove",
  },
];

const NewListing: FC<Props> = (props) => {
  const [productInfo, setProductInfo] = useState({ ...defaultInfo });
  const [busy, setBusy] = useState(false);
  const [showCategoryModal, setShowCatgeoryModal] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState("");
  const { authClient } = useClient();

  const { name, description, category, price, purchasingDate } = productInfo;

  const handleChange = (name: string) => (text: string) => {
    setProductInfo({ ...productInfo, [name]: text });
  };

  const handleSubmit = async () => {
    console.log("productInfo :>> ", productInfo);
    const { error } = await yupValidate(newProductSchema, productInfo);
    if (error) {
      return showMessage({ message: error, type: "danger" });
    }

    setBusy(true);

    const form = new FormData();

    type productInfokeys = keyof typeof productInfo;
    for (let key in productInfo) {
      const value = productInfo[key as productInfokeys];
      if (value instanceof Date) form.append(key, value.toISOString());
      else form.append(key, value);
    }

    //appending images
    const newImages = images.map((img, index) => ({
      name: "image_" + index,
      type: mime.getType(img),
      uri: img,
    }));

    for (let img of newImages) {
      form.append("images", img as any);
    }

    const response = await runAxiosAsync<{ message: string }>(
      authClient.post("/product/list", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    );

    setBusy(false);

    if (response) {
      showMessage({ message: response.message, type: "success" });
      setProductInfo({ ...defaultInfo });
      setImages([]);
    }
  };

  const handleImageSelection = async () => {
    try {
      const { assets } = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.3,
        allowsMultipleSelection: true,
      });

      if (!assets) return;

      const imageUris = assets.map(({ uri }) => uri);
      setImages([...images, ...imageUris]);
    } catch (error) {
      showMessage({ message: (error as any).message, type: "danger" });
    }
  };

  return (
    <CustomkeyAvoidingView>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Pressable style={styles.fileSelector} onPress={handleImageSelection}>
            <View style={styles.iconContainer}>
              <FontAwesome5 name="images" size={24} color="black" />
            </View>
            <Text style={styles.btnTitle}>Add Images</Text>
          </Pressable>
          <HorizontalImageList
            images={images}
            onLongPress={(img) => {
              setSelectedImage(img);
              setShowImageOptions(true);
            }}
          />
          {/* <FlatList
            data={images}
            renderItem={({ item }) => {
              return (
                <Image style={styles.selectedImage} source={{ uri: item }} />
              );
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
          /> */}
        </View>

        <FormInput
          value={name}
          placeholder="Product name"
          onChangeText={handleChange("name")}
        />
        <FormInput
          value={price}
          placeholder="Price"
          onChangeText={handleChange("price")}
          keyboardType="numeric"
        />
        <DatePicker
          title="Purchasing Date:"
          value={purchasingDate}
          onChange={(purchasingDate) =>
            setProductInfo({ ...productInfo, purchasingDate })
          }
        />
        <Pressable
          style={styles.categorySelector}
          onPress={() => setShowCatgeoryModal(true)}
        >
          <Text style={styles.categoryTitle}>{category ?? "Category"}</Text>
          <AntDesign name="caretdown" color={colors.primary} />
        </Pressable>
        <FormInput
          value={description}
          placeholder="Description"
          multiline
          numberOfLines={4}
          onChangeText={handleChange("description")}
        />

        <AppButton
          title="List Product"
          onPress={() => {
            handleSubmit();
          }}
        />
        {/* Category Options */}
        <OptionModal
          visible={showCategoryModal}
          onRequestClose={setShowCatgeoryModal}
          options={categories}
          renderItem={(item) => (
            <CategoryOptions icon={item.icon} name={item.name} />
          )}
          onPressItem={(item) => {
            setProductInfo({ ...productInfo, category: item.name });
          }}
        />
        {/* Image Options */}
        <OptionModal
          visible={showImageOptions}
          onRequestClose={setShowImageOptions}
          options={imageOptions}
          renderItem={(item) => (
            <Text style={styles.imageOption}>{item.id}</Text>
          )}
          onPressItem={(option) => {
            if (option.id === "remove") {
              const newImages = images.filter((img) => img !== selectedImage);
              setImages([...newImages]);
            }
          }}
        />
      </View>
      <LoadingSpinner visible={busy} />
    </CustomkeyAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
  },
  imageContainer: {
    flexDirection: "row",
    paddingBottom: 15,
  },
  btnTitle: {
    color: colors.primary,
    marginTop: 5,
  },
  fileSelector: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 7,
  },
  selectedImage: {
    width: 70,
    height: 70,
    borderRadius: 7,
    marginLeft: 5,
  },
  categorySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.inactive,
    borderRadius: 5,
  },
  categoryTitle: {
    color: colors.primary,
  },
  imageOption: {
    fontWeight: 600,
    fontSize: 18,
    color: colors.primary,
    padding: 10,
  },
});

export default NewListing;
