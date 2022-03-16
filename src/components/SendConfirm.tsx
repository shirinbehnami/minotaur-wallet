import React, { useState } from "react";
import { Button, Container, Grid } from "@material-ui/core";
import PasswordInput from "./PasswordInput";
import Wallet from "../db/entities/Wallet";
import { signTx } from "../action/blockchain";
import { Browser } from "@capacitor/browser";
import DisplayId from "./DisplayId";
import { show_notification } from "../utils/utils";
import { getNetworkType } from "../config/network_type";
import { validatePassword } from "../action/address";
import { UnsignedGeneratedTx } from "../utils/interface";

interface PropsType {
    close: () => any;
    wallet: Wallet;
    completed?: (txId: string) => any;
    transaction?: UnsignedGeneratedTx;
    display: boolean;
}

const SendConfirm = (props: PropsType) => {
    const [password, setPassword] = useState("");
    const [txResponse, setTxResponse] = useState("");
    const sendTx = () => {
        if (props.transaction) {
            signTx(props.wallet, props.transaction, password).then(signedTx => {
                const node = getNetworkType(props.wallet.network_type).getNode();
                node.sendTx(signedTx).then(result => {
                    setTxResponse(result.txId);
                    if(props.completed){
                        props.completed(result.txId);
                    }
                }).catch(exp => {
                    show_notification(exp);
                });
                setPassword("");
            }).catch(error => {
                show_notification(error);
            });
        }
    };
    const passwordValid = () => {
        return validatePassword(props.wallet, password)
    };
    const network_type = getNetworkType(props.wallet.network_type);
    return (
        <Container>
            <Grid container spacing={2}>
                {txResponse ? (
                    <Grid item xs={12}>
                        <br />
                        Your transaction is generated and submitted to network.
                        <br />
                        <br />
                        <div
                            onClick={() => Browser.open({ url: `${network_type.explorer_front}/en/transactions/${txResponse}` })}>
                            <DisplayId id={txResponse} />
                        </div>
                        <br />
                        It can take about 2 minutes to mine your transaction. also syncing your wallet may be slow
                        <br />
                        <br />
                    </Grid>
                ) : (
                    <React.Fragment>
                        <Grid item xs={12}>
                            <br/>
                            Please enter your mnemonic passphrase to send transaction
                        </Grid>
                        <Grid item xs={12}>
                            <PasswordInput
                                size={"small"}
                                label="Wallet password"
                                error=""
                                password={password}
                                setPassword={setPassword} />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" fullWidth color="primary" onClick={sendTx}
                                    disabled={!(props.transaction && passwordValid())}>
                                Send
                            </Button>
                        </Grid>
                    </React.Fragment>
                )}
            </Grid>
        </Container>
    );
};

export default SendConfirm;
