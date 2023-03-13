import { ethers } from "ethers";
import toast from "react-hot-toast";
import { useEmoji } from "../../contexts/EmojiContext";

export const connectAccount = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      toast.success("MetaMask account was connected successfully");
      return { address };
    } catch (error) {
      if (error.code === -32002) {
        toast.error("please accept the invite on your extension");
      } else if (error.code === 4001) {
        toast.error("you have rejected the connection");
      } else {
        toast.error("Error connecting please check your extension");
      }
      return null;
    }
  } else {
    toast.error("Meta Mask extension not detected please install it");
    return null;
  }
};

export const signEmoji = async (metaMaskAccount, emoji) => {
  try {
    if (!window.ethereum) {
      toast.error("No crypto wallet found. Please install it.");
      // throw new Error("No crypto wallet found. Please install it.");
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const signature = await signer.signMessage(emoji);
      toast.success(`${emoji} was signed successfully`);
      return {
        success: true,
        emoji,
        signature,
        address: metaMaskAccount.address,
      };
    } catch (err) {
      if (err.code === 4001) {
        toast.error(`you have rejected the signing of emoji ${emoji}`);
      } else {
        toast.error(`failed to sign emoji ${emoji}`);
      }
      return {
        success: false,
        error: "rejected",
        emoji,
      };
    }
  } catch (err) {
    toast.error(`failed to sign emoji ${emoji} due to extension issue`);
    return {
      success: false,
      error: "noaccount",
    };
  }
};

export const signSingleEmoji = async (emoji) => {
  //only try to sign emojis that aren't already signed
  const result = await signEmoji(emoji);
  return result;
};

export const verifyEmoji = async ({ emoji, address, signature }) => {
  try {
    const signerAddr = await ethers.utils.verifyMessage(emoji, signature);
    if (signerAddr !== address) {
      return false;
    }

    return true;
  } catch (err) {
    toast.error(
      `couldn't validate emoji ${emoji} please press the sign button again`
    );
    return false;
  }
};
