import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ethers, utils } from "ethers";
import { connect } from "../features/blockchain";
import {
  Button,
  Input,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { Folder } from "@mui/icons-material";

import { StoreContent } from "../utils/StoreContent";
import SmartContract from "../artifacts/contracts/FileStorage.json";
import contractsAddress from "../artifacts/deployments/map.json";
import networks from "../utils/networksMap.json";

// contract address on ganache network
const ads = contractsAddress["5777"]["FileStorage"][0];
// contract address on polygon mumbai test network
// const ads = contractsAddress["80001"]["FileStorage"][0]

function FileStorage() {
  const data = useSelector((state) => state.blockchain.value);
  const dispatch = useDispatch();

  const [file, setFile] = useState({
    name: "",
    size: null,
    selectedFile: null,
  });
  const [userFiles, setUserFiles] = useState([]);

  const [loading, setLoading] = useState(false);

  const updateBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const balance = await signer.getBalance();
    dispatch(connect({ ...data, balance: utils.formatUnits(balance) }));
  };

  // read uploaded file using FileReader and buffer
  const getFile = (e) => {
    e.preventDefault();
    const uploadedFile = e.target.files[0];

    setFile({
      name: uploadedFile.name,
      size: uploadedFile.size,
      selectedFile: uploadedFile,
    });
  };

  // a function to convert file size to readable format ex: KB, MB...
  const niceBytes = (x) => {
    const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let l = 0,
      n = parseInt(x, 10) || 0;
    while (n >= 1024 && ++l) {
      n = n / 1024;
    }
    return String(n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l]);
  };

  const upload = async () => {
    if (file.selectedFile !== undefined) {
      try {
        setLoading(true);

        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        const signer = provider.getSigner();
        const storageContract = new ethers.Contract(
          ads,
          SmartContract.abi,
          signer
        );

        const cid = await StoreContent(file.selectedFile);
        const ipfsHash = `ipfs://${cid}/${file.name}`;

        const fee = await storageContract.getListingFee();

        const add_tx = await storageContract.uploadFile(
          file.name,
          file.size,
          ipfsHash,
          {
            value: fee,
          }
        );
        await add_tx.wait();

        setLoading(false);

        getUserFiles();

        setFile({
          name: "",
          size: null,
          selectedFile: null,
        });
        updateBalance();
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
  };

  const getUserFiles = async () => {
    if (data.account !== "" && isGoodNet) {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      const signer = provider.getSigner();
      const storageContract = new ethers.Contract(
        ads,
        SmartContract.abi,
        signer
      );

      const filesList = await storageContract.getUserFiles(data.account);
      setUserFiles(filesList);
    }
  };

  useEffect(() => {
    if (window.ethereum !== undefined) {
      getUserFiles();
    }
  }, [userFiles, data.account, data.network]);

  // ganache network is used for testing purposes
  const currentNetwork = networks["1337"];

  // switch to polygon mainnet/testnet for production
  // const currentNetwork = networks["80001"]

  const isGoodNet = data.network === currentNetwork;

  const isConnected = data.account !== "";
  return (
    <>
      {isConnected ? (
        isGoodNet ? (
          <>
            <div>
              <Input
                type="file"
                name="file"
                onChange={(e) => {
                  getFile(e);
                }}
              />
            </div>
            <br />

            {file.selectedFile !== null ? (
              <div>
                <p>file name: {file.name}</p>
                <p>file size: {niceBytes(file.size)}</p>
              </div>
            ) : null}

            <div style={{ paddingBottom: "30px" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  upload();
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="#fff" />
                ) : (
                  "upload"
                )}
              </Button>
            </div>
            {userFiles.length !== 0 ? (
              <h1>You have {userFiles.length} files uploaded</h1>
            ) : (
              <h1>You didn't upload any file</h1>
            )}
            <div style={{ paddingLeft: "30%" }}>
              <List>
                {userFiles.map((fileData, i) => {
                  const uploadDate = new Date(
                    fileData.uploadDate.toNumber() * 1000
                  ).toLocaleString();
                  const uri = fileData.uri.replace(
                    "ipfs://",
                    "https://gateway.pinata.cloud/ipfs/"
                  );
                  return (
                    <ListItem key={i}>
                      <ListItemIcon>
                        <Folder />
                      </ListItemIcon>
                      <a
                        href={uri}
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        <ListItemText
                          primary={fileData.name}
                          secondary={
                            niceBytes(fileData.size) + "   ||   " + uploadDate
                          }
                        />
                      </a>
                    </ListItem>
                  );
                })}
              </List>
            </div>
          </>
        ) : (
          <p>You are on the wrong network switch to {currentNetwork} network</p>
        )
      ) : null}
    </>
  );
}

export default FileStorage;
