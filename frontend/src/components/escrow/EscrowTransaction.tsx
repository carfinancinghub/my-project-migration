/**
 * @file EscrowTransaction.tsx
 * @path C:\CFH\frontend\src\components\escrow\EscrowTransaction.tsx
 * @author Mini Team
 * @created 2025-06-10 [0823]
 * @purpose Renders the main user interface for viewing and managing a single escrow transaction.
 * @user_impact Allows users to track their transaction status, manage conditions, and initiate actions.
 * @version 1.0.0
 */
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { escrowApi, proposeConditionSchema } from '../../services/escrowApi';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { trackEvent } from '../../utils/UserBehaviorTracker';

const ProposeConditionModal = ({ transactionId, onClose }: { transactionId: string, onClose: () => void }) => {
    const { t } = useTranslation();
    const [description, setDescription] = useState('');
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        trackEvent('modal_opened', { modal: 'propose_condition', transactionId });
    }, [transactionId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const { error: validationError } = proposeConditionSchema.validate({ description });
        if (validationError) {
            setError(validationError.message);
            return;
        }
        try {
            await escrowApi.proposeCondition(transactionId, description);
            trackEvent('condition_proposed', { transactionId, descriptionLength: description.length });
            onClose();
        } catch (apiError: any) {
            setError(apiError.response?.data?.message || t('errors.api_error'));
        }
    };

    return (
        <div role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <h2 id="modal-title">{t('escrow.propose_condition')}</h2>
            <form aria-label={t('escrow.propose_form_label')} onSubmit={handleSubmit}>
                <label htmlFor="condition-desc">{t('escrow.condition_description')}</label>
                <input
                    id="condition-desc"
                    ref={inputRef}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    aria-describedby="error-message"
                />
                {error && <div id="error-message" role="alert" style={{ color: 'red' }}>{error}</div>}
                <button type="submit">{t('escrow.submit_proposal')}</button>
                <button type="button" onClick={onClose} aria-label={t('escrow.close_dialog')}>
                    {t('escrow.close')}
                </button>
            </form>
        </div>
    );
};

const EscrowTransactionWrapper: React.FC<{ transactionId: string }> = ({ transactionId }) => {
    const { t } = useTranslation();
    const [transaction, setTransaction] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showConditionModal, setShowConditionModal] = useState(false);
    const addConditionButtonRef = useRef<HTMLButtonElement>(null);
    const errorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        escrowApi.getTransaction(transactionId)
            .then(response => setTransaction(response.data))
            .catch(err => setError(err.response?.data?.message || t('errors.transaction_fetch')));
        trackEvent('transaction_viewed', { transactionId });
    }, [transactionId, t]);

    useEffect(() => {
        if (error) errorRef.current?.focus();
    }, [error]);

    const closeConditionModal = () => {
        setShowConditionModal(false);
        addConditionButtonRef.current?.focus();
        trackEvent('modal_closed', { modal: 'propose_condition', transactionId });
    };

    return (
        <main aria-labelledby="transaction-heading">
            {transaction && <h1 id="transaction-heading">{t('escrow.transaction_title', { id: transaction._id })}</h1>}
            {error && <div ref={errorRef} role="alert" tabIndex={-1}>{error}</div>}
            <button
                ref={addConditionButtonRef}
                onClick={() => setShowConditionModal(true)}
                aria-label={t('escrow.propose_condition_aria')}
            >
                {t('escrow.propose_condition')}
            </button>
            {showConditionModal && transaction && (
                <ProposeConditionModal transactionId={transaction._id} onClose={closeConditionModal} />
            )}
        </main>
    );
};

export const EscrowTransaction: React.FC<{ transactionId: string }> = ({ transactionId }) => (
    <ErrorBoundary>
        <EscrowTransactionWrapper transactionId={transactionId} />
    </ErrorBoundary>
);
