#!/usr/bin/env python

import torchvision.transforms as transforms
import torchvision.datasets as dset

#CUDA_VISIBLE_DEVICES=0 ./search_algorithm/run_milenas.sh "0" 200003 1 50 "saved_models" 0.025 0.0003 2021 8

#parser.add_argument('--data', type=str, default='../data', help='location of the data corpus')
data = "./data"

#parser.add_argument('--cutout', action='store_true', default=False, help='use cutout')
#parser.add_argument('--cutout_length', type=int, default=16, help='cutout length')
cutout = False
cutout_length = 16

LAMBDA_VALID=1
lambda_train_regularizer = 1
lambda_valid_regularizer = LAMBDA_VALID

#-------------------------------------------------
# Transforms function
#-------------------------------------------------
def data_transforms_cifar10(cutout, cutout_length):
    CIFAR_MEAN = [0.49139968, 0.48215827, 0.44653124]
    CIFAR_STD = [0.24703233, 0.24348505, 0.26158768]

    train_transform = transforms.Compose([
        transforms.RandomCrop(32, padding=4),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor(),
        transforms.Normalize(CIFAR_MEAN, CIFAR_STD),
    ])
    if cutout:
        train_transform.transforms.append(Cutout(cutout_length))

    valid_transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize(CIFAR_MEAN, CIFAR_STD),
    ])
    return train_transform, valid_transform

#-------------------------------------------------

# download & transform CIFAR-10 data
train_transform, valid_transform = data_transforms_cifar10(cutout, cutout_length)
train_data = dset.CIFAR10(root=data, train=True, download=True, transform=train_transform)
