import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
import os

# 1. Configuration
# Ensure you have a 'dataset' folder with subfolders for each class: 'Fresh', 'Medium', 'Poor'
DATASET_DIR = "dataset" 
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10
NUM_CLASSES = 3

def build_model():
    """Builds a transfer learning model using MobileNetV2."""
    # Load the base model pre-trained on ImageNet, excluding the top classification layer
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(*IMG_SIZE, 3))
    
    # Freeze the base model layers so we only train the new classification head
    base_model.trainable = False

    # Add custom layers on top for our 3 classes
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.5)(x)
    predictions = Dense(NUM_CLASSES, activation='softmax')(x)

    model = Model(inputs=base_model.input, outputs=predictions)
    
    model.compile(optimizer='adam', 
                  loss='categorical_crossentropy', 
                  metrics=['accuracy'])
    return model

def train():
    if not os.path.exists(DATASET_DIR):
        print(f"Error: Dataset directory '{DATASET_DIR}' not found.")
        print("Please create it and add 'Fresh', 'Medium', and 'Poor' subfolders with images.")
        return

    # 2. Data Preparation mapping directly to your FastApi preprocessing
    # Using ImageDataGenerator for data augmentation and feeding data during training
    datagen = ImageDataGenerator(
        rescale=1./255,      # Normalization (matches backend `img_array / 255.0`)
        validation_split=0.2, # 80% for training, 20% for validation
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True
    )

    train_generator = datagen.flow_from_directory(
        DATASET_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training'
    )

    val_generator = datagen.flow_from_directory(
        DATASET_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation'
    )

    # Note the class indices so they match your backend mapping
    print("Class mapping:", train_generator.class_indices)

    # 3. Build and Train Model
    print("Building model...")
    model = build_model()
    
    print("Starting training...")
    history = model.fit(
        train_generator,
        validation_data=val_generator,
        epochs=EPOCHS
    )

    # 4. Save the Model
    model.save("fruit_quality.h5")
    print("Model saved to fruit_quality.h5 successfully.")

if __name__ == "__main__":
    train()
